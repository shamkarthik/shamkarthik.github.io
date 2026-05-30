import { useEffect, useRef } from "react"

interface Point { x: number; y: number }
interface Bolt { pts: Point[]; branches: Point[][]; life: number; maxLife: number }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }

function dist(a: Point, b: Point) { return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2) }

/** Jagged random walk — real lightning doesn't bisect, it STEPS with sharp turns */
function jaggedBolt(from: Point, to: Point, jitter: number): Point[] {
  const pts: Point[] = [{ ...from }]
  let x = from.x, y = from.y
  const totalDist = dist(from, to)
  if (totalDist < 5) return [from, to]

  const steps = 8 + Math.floor(Math.random() * 8)
  const baseStep = totalDist / steps

  for (let i = 0; i < steps * 3; i++) {
    const remaining = dist({ x, y }, to)
    if (remaining < baseStep * 0.5) break

    const targetAngle = Math.atan2(to.y - y, to.x - x)

    // Two-regime jitter: 70% small zigzag, 30% sharp turn
    let jit: number
    if (Math.random() < 0.65) {
      jit = jitter * (0.1 + Math.random() * 0.25)
    } else {
      jit = jitter * (0.5 + Math.random() * 1.2)
    }

    const jitterAngle = (Math.random() - 0.5) * jit
    const angle = targetAngle + jitterAngle

    // Step size: bigger when jitter is small, smaller when turning hard
    const stepMul = 1 - Math.abs(jitterAngle) / Math.PI * 0.5
    const step = Math.max(baseStep * 0.3, remaining * 0.4 * stepMul)

    x += Math.cos(angle) * step
    y += Math.sin(angle) * step

    // Keep within bounds of destination (don't fly past)
    if (dist({ x, y }, to) > remaining * 1.3) {
      x -= Math.cos(angle) * step * 0.6
      y -= Math.sin(angle) * step * 0.6
      continue
    }

    pts.push({ x, y })
  }

  pts.push({ ...to })
  return pts
}

/** Jagged branches — shoot off at sharp angles, shorter, more chaotic */
function makeBranchesJagged(main: Point[], jitter: number): Point[][] {
  const branches: Point[][] = []
  const halfIdx = Math.floor(main.length * 0.35)

  for (let si = halfIdx; si < main.length - 1; si++) {
    if (Math.random() > 0.25) continue

    const a = main[si], b = main[si + 1]
    const t = 0.1 + Math.random() * 0.8
    const origin: Point = {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    }

    const dx = b.x - a.x, dy = b.y - a.y
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    // Perpendicular + random sharp angle
    const side = Math.random() > 0.5 ? 1 : -1
    const angle = Math.atan2(dy, dx) + side * (Math.PI * 0.4 + Math.random() * 0.5)

    const branchLen = 25 + Math.random() * 100
    const end: Point = {
      x: origin.x + Math.cos(angle) * branchLen,
      y: origin.y + Math.sin(angle) * branchLen,
    }

    const pts = jaggedBolt(origin, end, jitter * 0.6)
    if (pts.length >= 2) branches.push(pts)
  }
  return branches
}

function getCardPositions(w: number, h: number): Point[] {
  const pts: Point[] = []
  const cards = document.querySelectorAll<HTMLElement>(
    '[class*="card"], [class*="Card"], section, [class*="service"], article, [class*="hero"], nav, footer, [class*="badge"]'
  )
  cards.forEach(el => {
    const rect = el.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      pts.push({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2 + 20,
      })
    }
  })
  if (pts.length === 0) {
    for (let i = 0; i < 6; i++) pts.push({ x: Math.random() * w, y: Math.random() * h })
  }
  return pts
}

function emitSparks(sparks: Spark[], x: number, y: number, count: number) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 1 + Math.random() * 5
    sparks.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 0,
      maxLife: 20 + Math.random() * 60,
    })
  }
}

function CanvasLightning({ onRef }: { onRef: (el: HTMLCanvasElement | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -999, y: -999, active: false })
  const sparksRef = useRef<Spark[]>([])
  const boltsRef = useRef<Bolt[]>([])
  const timeRef = useRef(0)
  const cardOriginsRef = useRef<Point[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    onRef(canvas)
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let w = 0, h = 0

    function resize() {
      w = canvas!.width = window.innerWidth
      h = canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true }
    }
    const onLeave = () => { mouseRef.current.active = false }

    window.addEventListener("mousemove", onMouse)
    window.addEventListener("mouseleave", onLeave)

    const onClick = (e: MouseEvent) => {
      const cx = e.clientX, cy = e.clientY
      const angle = Math.random() * Math.PI * 2
      const d2 = 200 + Math.random() * 400
      const target = {
        x: cx + Math.cos(angle) * d2,
        y: cy + Math.sin(angle) * d2,
      }
      const main = jaggedBolt({ x: cx, y: cy }, target, 0.8 + Math.random() * 0.4)
      boltsRef.current.push({
        pts: main,
        branches: makeBranchesJagged(main, 0.8),
        life: 0,
        maxLife: 0.7 + Math.random() * 0.3,
      })
      emitSparks(sparksRef.current, cx, cy, 30)
    }
    window.addEventListener("click", onClick)

    let scrollY = 0
    const onScroll = () => {
      const sy = window.scrollY
      if (sy - scrollY > 100) {
        const origins = getCardPositions(w, h)
        for (let i = 0; i < 2; i++) {
          if (origins.length > 0) {
            const origin = origins[Math.floor(Math.random() * origins.length)]
            const a2 = Math.random() * Math.PI * 2
            const d2 = 150 + Math.random() * 250
            const target = {
              x: origin.x + Math.cos(a2) * d2,
              y: origin.y + Math.sin(a2) * d2,
            }
            const main = jaggedBolt(origin, target, 0.7 + Math.random() * 0.3)
            boltsRef.current.push({
              pts: main,
              branches: makeBranchesJagged(main, 0.7),
              life: 0,
              maxLife: 0.7 + Math.random() * 0.3,
            })
            emitSparks(sparksRef.current, origin.x, origin.y, 15)
          }
        }
      }
      scrollY = sy
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    function spawnBolt() {
      const origins = getCardPositions(w, h)
      if (origins.length === 0) return
      const from = origins[Math.floor(Math.random() * origins.length)]
      const target = Math.random() > 0.5 && origins.length > 1
        ? origins[Math.floor(Math.random() * origins.length)]
        : { x: Math.random() * w, y: Math.random() * h }
      const main = jaggedBolt(from, target, 0.7 + Math.random() * 0.4)
      boltsRef.current.push({
        pts: main,
        branches: makeBranchesJagged(main, 0.7),
        life: 0,
        maxLife: 0.6 + Math.random() * 0.5,
      })
      emitSparks(sparksRef.current, from.x, from.y, 10)
    }

    function spawnEdgeSweep() {
      const sides = [
        { from: { x: -50, y: Math.random() * h }, to: { x: w + 50, y: Math.random() * h } },
        { from: { x: w + 50, y: Math.random() * h }, to: { x: -50, y: Math.random() * h } },
        { from: { x: Math.random() * w, y: -50 }, to: { x: Math.random() * w, y: h + 50 } },
        { from: { x: Math.random() * w, y: h + 50 }, to: { x: Math.random() * w, y: -50 } },
      ]
      const s = sides[Math.floor(Math.random() * 4)]
      const main = jaggedBolt(s.from, s.to, 0.5 + Math.random() * 0.3)
      boltsRef.current.push({
        pts: main,
        branches: makeBranchesJagged(main, 0.5),
        life: 0,
        maxLife: 0.4 + Math.random() * 0.2,
      })
    }

    let boltTimer = 0, sweepTimer = 0, cardRefreshTimer = 0

    function draw(t: number) {
      animId = requestAnimationFrame(draw)
      const dt = Math.min((t - timeRef.current) / 1000, 0.05)
      timeRef.current = t

      ctx!.clearRect(0, 0, w, h)

      // Ambient mouse glow
      if (mouseRef.current.active) {
        const g = ctx!.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 300,
        )
        g.addColorStop(0, "rgba(0, 212, 255, 0.12)")
        g.addColorStop(1, "rgba(0, 212, 255, 0)")
        ctx!.fillStyle = g
        ctx!.fillRect(0, 0, w, h)
      }

      // Breathing ambient
      const pulse = 0.3 + 0.7 * Math.sin(t / 1800)
      ctx!.fillStyle = `rgba(0, 212, 255, ${0.025 * pulse})`
      ctx!.fillRect(0, 0, w, h)
      const pPulse = 0.3 + 0.7 * Math.sin(t / 2200 + 1)
      ctx!.fillStyle = `rgba(139, 92, 246, ${0.015 * pPulse})`
      ctx!.fillRect(0, 0, w, h)

      // Natural bolts
      boltTimer += dt
      if (boltTimer > 1.2 + Math.random() * 2) { spawnBolt(); boltTimer = 0 }

      // Edge sweeps
      sweepTimer += dt
      if (sweepTimer > 2 + Math.random() * 3) { spawnEdgeSweep(); sweepTimer = 0 }

      // Refresh card positions
      cardRefreshTimer += dt
      if (cardRefreshTimer > 1.5) {
        cardOriginsRef.current = getCardPositions(w, h)
        cardRefreshTimer = 0
      }

      // Draw bolts
      const bolts = boltsRef.current
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i]
        b.life += dt
        if (b.life >= b.maxLife) { bolts.splice(i, 1); continue }

        const progress = b.life / b.maxLife
        let drawProgress: number, alpha: number, glowW: number, glowBoost = 1

        if (progress < 0.2) {
          drawProgress = progress / 0.2
          alpha = drawProgress * 0.55
          glowW = 1 + drawProgress * 2
        } else if (progress < 0.55) {
          drawProgress = 1
          const flashIn = (progress - 0.2) / 0.35
          alpha = 0.55 + flashIn * 0.35
          glowW = 3 - flashIn * 0.5
          glowBoost = 1 + (1 - flashIn) * 0.6
        } else {
          const fade = (progress - 0.55) / 0.45
          drawProgress = 1
          alpha = 0.9 * (1 - fade)
          glowW = 2.5
          glowBoost = 1 - fade * 0.3
        }

        const drawLen = Math.max(2, Math.floor(b.pts.length * drawProgress))
        const shadowBlur = 14 * glowBoost

        // Glow layer
        ctx!.strokeStyle = `rgba(0, 212, 255, ${alpha})`
        ctx!.lineWidth = glowW
        ctx!.shadowColor = `rgba(0, 212, 255, ${alpha * 0.5 * glowBoost})`
        ctx!.shadowBlur = shadowBlur
        ctx!.beginPath()
        ctx!.moveTo(b.pts[0].x, b.pts[0].y)
        for (let j = 1; j < Math.min(drawLen, b.pts.length); j++) ctx!.lineTo(b.pts[j].x, b.pts[j].y)
        ctx!.stroke()

        // Core
        ctx!.strokeStyle = `rgba(200, 240, 255, ${alpha * 0.95})`
        ctx!.lineWidth = 1.5
        ctx!.shadowBlur = 0
        ctx!.beginPath()
        ctx!.moveTo(b.pts[0].x, b.pts[0].y)
        for (let j = 1; j < Math.min(drawLen, b.pts.length); j++) ctx!.lineTo(b.pts[j].x, b.pts[j].y)
        ctx!.stroke()

        // Branches
        for (const br of b.branches) {
          const brLen = Math.max(2, Math.floor(br.length * drawProgress * 0.8))
          const ba = alpha * 0.45
          const bgw = glowW * 0.35

          ctx!.strokeStyle = `rgba(0, 212, 255, ${ba})`
          ctx!.lineWidth = bgw
          ctx!.shadowColor = `rgba(0, 212, 255, ${ba * 0.4})`
          ctx!.shadowBlur = shadowBlur * 0.35
          ctx!.beginPath()
          ctx!.moveTo(br[0].x, br[0].y)
          for (let j = 1; j < Math.min(brLen, br.length); j++) ctx!.lineTo(br[j].x, br[j].y)
          ctx!.stroke()

          // Branch core
          ctx!.strokeStyle = `rgba(180, 220, 255, ${ba * 0.8})`
          ctx!.lineWidth = 0.8
          ctx!.shadowBlur = 0
          ctx!.beginPath()
          ctx!.moveTo(br[0].x, br[0].y)
          for (let j = 1; j < Math.min(brLen, br.length); j++) ctx!.lineTo(br[j].x, br[j].y)
          ctx!.stroke()
        }

        // Tip sparks during leader
        if (progress < 0.25 && drawLen < b.pts.length) {
          emitSparks(sparksRef.current, b.pts[Math.min(drawLen, b.pts.length - 1)].x, b.pts[Math.min(drawLen, b.pts.length - 1)].y, 2)
        }
      }

      // Mouse sparks
      if (mouseRef.current.active && Math.random() > 0.5) {
        emitSparks(sparksRef.current, mouseRef.current.x, mouseRef.current.y, 4)
      }

      // Draw sparks
      const sp = sparksRef.current
      for (let i = sp.length - 1; i >= 0; i--) {
        const s = sp[i]
        s.life++
        if (s.life >= s.maxLife) { sp.splice(i, 1); continue }
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.04
        const lr = s.life / s.maxLife
        const a = (1 - lr) * 0.85
        ctx!.fillStyle = `rgba(180, 220, 255, ${a})`
        ctx!.shadowColor = `rgba(0, 212, 255, 0.5)`
        ctx!.shadowBlur = 8
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, 0.9 * (1 - lr * 0.5), 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.shadowBlur = 0
    }

    // Pre-seed
    for (let i = 0; i < 3; i++) {
      const origins = getCardPositions(w, h)
      if (origins.length > 0) {
        const from = origins[Math.floor(Math.random() * origins.length)]
        const to = { x: Math.random() * w, y: Math.random() * h }
        const main = jaggedBolt(from, to, 0.7)
        boltsRef.current.push({
          pts: main,
          branches: makeBranchesJagged(main, 0.7),
          life: Math.random() * 0.25,
          maxLife: 0.6 + Math.random() * 0.4,
        })
      }
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouse)
      window.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("click", onClick)
      window.removeEventListener("scroll", onScroll)
    }
  }, [onRef])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  )
}

export default function ElectricEffect() {
  return <CanvasLightning onRef={() => {}} />
}

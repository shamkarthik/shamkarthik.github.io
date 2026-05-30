import { useEffect, useRef, useState } from "react"

interface Point { x: number; y: number }
interface Bolt { pts: Point[]; branches: BranchBolt[]; life: number; maxLife: number; completed: boolean }
interface BranchBolt { pts: Point[]; subBranches: Point[][]; fromIdx: number }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; hue: number }

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

/** Fractal midpoint displacement — produces realistic stepped-leader zigzag */
function fractalBolt(
  from: Point,
  to: Point,
  displacement: number,
  detail: number,
): Point[] {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const dist = Math.sqrt(dx * dx + dy * dy)

  if (dist < 5 || detail <= 0) return [from, to]

  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2

  // Perpendicular to the bolt direction (normalized)
  const px = -dy / dist
  const py = dx / dist

  // Displacement increases toward the tip (makes tip more jagged = realistic)
  const d = (Math.random() * 2 - 1) * displacement * dist * (0.18 + 0.06 * (1 - detail / 8))
  const rmx = mx + px * d
  const rmy = my + py * d

  const left = fractalBolt(from, { x: rmx, y: rmy }, displacement * 0.62, detail - 1)
  const right = fractalBolt({ x: rmx, y: rmy }, to, displacement * 0.62, detail - 1)

  return left.concat(right.slice(1))
}

/** Generate branches using the same fractal algorithm — only on lower half of bolt */
function makeBranchesRealistic(
  main: Point[],
  displacement: number,
  detail: number,
): BranchBolt[] {
  const branches: BranchBolt[] = []
  const halfIdx = Math.floor(main.length * 0.4)

  for (const segIdx of main.keys()) {
    if (segIdx < halfIdx) continue
    if (segIdx >= main.length - 1) continue

    if (Math.random() > 0.35) continue

    const a = main[segIdx]
    const b = main[segIdx + 1]
    const t = 0.2 + Math.random() * 0.6
    const origin = { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }

    const dx = b.x - a.x
    const dy = b.y - a.y
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const nx = -dy / len
    const ny = dx / len

    // Fork at acute angle, swinging outward from bolt
    const side = Math.random() > 0.5 ? 1 : -1
    const angleOff = (Math.random() * 0.5 + 0.2) * side
    const angle = Math.atan2(ny * side, nx * side) + angleOff
    const branchLen = 40 + Math.random() * 120

    const end = {
      x: origin.x + Math.cos(angle) * branchLen,
      y: origin.y + Math.sin(angle) * branchLen,
    }

    const branchPts = fractalBolt(origin, end, displacement * 0.5, detail - 2)

    // Sub-branches on this branch
    const subBranches: Point[][] = []
    const subHalf = Math.floor(branchPts.length * 0.3)
    for (const si of branchPts.keys()) {
      if (si < subHalf) continue
      if (si >= branchPts.length - 1) continue
      if (Math.random() > 0.3) continue

      const sa = branchPts[si]
      const sb = branchPts[si + 1]
      const st = 0.3 + Math.random() * 0.4
      const sorigin = { x: lerp(sa.x, sb.x, st), y: lerp(sa.y, sb.y, st) }

      const sdx = sb.x - sa.x
      const sdy = sb.y - sa.y
      const slen = Math.sqrt(sdx * sdx + sdy * sdy) || 1
      const snx = -sdy / slen
      const sny = sdx / slen
      const sside = Math.random() > 0.5 ? 1 : -1
      const sangle = Math.atan2(sny * sside, snx * sside) + (Math.random() - 0.5) * 0.8
      const sl = 15 + Math.random() * 40
      const send = {
        x: sorigin.x + Math.cos(sangle) * sl,
        y: sorigin.y + Math.sin(sangle) * sl,
      }
      subBranches.push(fractalBolt(sorigin, send, displacement * 0.3, detail - 3))
    }

    branches.push({ pts: branchPts, subBranches, fromIdx: segIdx })
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
    for (let i = 0; i < 6; i++) {
      pts.push({ x: Math.random() * w, y: Math.random() * h })
    }
  }
  return pts
}

function hasWebGPU(): boolean {
  return 'gpu' in navigator && typeof navigator.gpu !== 'undefined'
}

function emitSparks(
  sparks: Spark[], x: number, y: number, count: number,
  hue = 200,
) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 1 + Math.random() * 5
    sparks.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 0,
      maxLife: 30 + Math.random() * 70,
      hue: hue + (Math.random() - 0.5) * 30,
    })
  }
}

function drawBoltSeg(
  ctx: CanvasRenderingContext2D,
  pts: Point[],
  alpha: number,
  glowW: number,
  progress: number,
) {
  if (pts.length < 2) return
  const drawLen = Math.max(2, Math.floor(pts.length * progress))

  ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`
  ctx.lineWidth = glowW
  ctx.shadowColor = `rgba(0, 212, 255, ${alpha * 0.5})`
  ctx.shadowBlur = 14
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let j = 1; j < drawLen && j < pts.length; j++) ctx.lineTo(pts[j].x, pts[j].y)
  ctx.stroke()

  // Core
  ctx.strokeStyle = `rgba(200, 240, 255, ${alpha * 0.9})`
  ctx.lineWidth = 1.2
  ctx.shadowBlur = 0
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let j = 1; j < drawLen && j < pts.length; j++) ctx.lineTo(pts[j].x, pts[j].y)
  ctx.stroke()
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
      const dist = 200 + Math.random() * 400
      const target = {
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
      }
      const main = fractalBolt({ x: cx, y: cy }, target, 0.25 + Math.random() * 0.1, 8)
      boltsRef.current.push({
        pts: main,
        branches: makeBranchesRealistic(main, 0.25, 7),
        life: 0,
        maxLife: 0.8 + Math.random() * 0.4,
        completed: false,
      })
      emitSparks(sparksRef.current, cx, cy, 25)
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
            const angle = Math.random() * Math.PI * 2
            const dist = 120 + Math.random() * 280
            const target = {
              x: origin.x + Math.cos(angle) * dist,
              y: origin.y + Math.sin(angle) * dist,
            }
            const main = fractalBolt(origin, target, 0.2 + Math.random() * 0.1, 7)
            boltsRef.current.push({
              pts: main,
              branches: makeBranchesRealistic(main, 0.2, 6),
              life: 0,
              maxLife: 0.8 + Math.random() * 0.4,
              completed: false,
            })
            emitSparks(sparksRef.current, origin.x, origin.y, 12)
          }
        }
      }
      scrollY = sy
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    function spawnBolt() {
      const origins = getCardPositions(w, h)
      if (origins.length > 0) {
        const from = origins[Math.floor(Math.random() * origins.length)]
        const isEdgeBolt = Math.random() > 0.5
        let target: Point
        if (isEdgeBolt) {
          target = { x: Math.random() * w, y: Math.random() * h }
        } else if (origins.length > 1) {
          target = origins[Math.floor(Math.random() * origins.length)]
        } else {
          target = {
            x: from.x + (Math.random() - 0.5) * 500,
            y: from.y + (Math.random() - 0.5) * 500,
          }
        }
        const main = fractalBolt(from, target, 0.2 + Math.random() * 0.12, 7 + Math.floor(Math.random() * 2))
        boltsRef.current.push({
          pts: main,
          branches: makeBranchesRealistic(main, 0.2, 6),
          life: 0,
          maxLife: 0.7 + Math.random() * 0.6,
          completed: false,
        })
        emitSparks(sparksRef.current, from.x, from.y, 8)
      }
    }

    function spawnEdgeSweep() {
      const side = Math.floor(Math.random() * 4)
      let from: Point, to: Point
      const m = 50
      switch (side) {
        case 0: from = { x: -m, y: Math.random() * h }; to = { x: w + m, y: Math.random() * h }; break
        case 1: from = { x: w + m, y: Math.random() * h }; to = { x: -m, y: Math.random() * h }; break
        case 2: from = { x: Math.random() * w, y: -m }; to = { x: Math.random() * w, y: h + m }; break
        default: from = { x: Math.random() * w, y: h + m }; to = { x: Math.random() * w, y: -m }; break
      }
      const main = fractalBolt(from, to, 0.15 + Math.random() * 0.08, 7)
      boltsRef.current.push({
        pts: main,
        branches: makeBranchesRealistic(main, 0.15, 6),
        life: 0,
        maxLife: 0.5 + Math.random() * 0.3,
        completed: false,
      })
    }

    let boltTimer = 0
    let sweepTimer = 0
    let cardRefreshTimer = 0

    function draw(t: number) {
      animId = requestAnimationFrame(draw)
      const dt = Math.min((t - timeRef.current) / 1000, 0.05)
      timeRef.current = t

      ctx!.clearRect(0, 0, w, h)

      // Ambient glow at mouse
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

      // Breathing ambient — blue + purple
      const pulse = 0.3 + 0.7 * Math.sin(t / 1800)
      ctx!.fillStyle = `rgba(0, 212, 255, ${0.025 * pulse})`
      ctx!.fillRect(0, 0, w, h)
      const pPulse = 0.3 + 0.7 * Math.sin(t / 2200 + 1)
      ctx!.fillStyle = `rgba(139, 92, 246, ${0.015 * pPulse})`
      ctx!.fillRect(0, 0, w, h)

      // Natural bolts
      boltTimer += dt
      if (boltTimer > 1.2 + Math.random() * 2) {
        spawnBolt()
        boltTimer = 0
      }

      // Edge sweeps
      sweepTimer += dt
      if (sweepTimer > 2 + Math.random() * 3) {
        spawnEdgeSweep()
        sweepTimer = 0
      }

      // Refresh card origins
      cardRefreshTimer += dt
      if (cardRefreshTimer > 1.5) {
        cardOriginsRef.current = getCardPositions(w, h)
        cardRefreshTimer = 0
      }

      // Draw bolts — progressive draw (stepped leader effect)
      const bolts = boltsRef.current
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i]
        b.life += dt
        if (b.life >= b.maxLife) { bolts.splice(i, 1); continue }

        const progress = b.life / b.maxLife
        if (progress > 1) continue

        // Step 1: leader stroke (fast forward propagation) — first 25% of life
        // Step 2: full bolt visible 25-60%
        // Step 3: fade out 60-100%
        let drawProgress: number
        let alpha: number
        let glowW: number
        let glowBoost = 1

        if (progress < 0.25) {
          // Leader stroke — bolt grows forward
          drawProgress = progress / 0.25  // 0→1
          alpha = drawProgress * 0.6
          glowW = 1.5 + drawProgress * 2
        } else if (progress < 0.55) {
          // Full bolt with flash
          drawProgress = 1
          const flashIn = (progress - 0.25) / 0.3
          alpha = 0.6 + flashIn * 0.3
          glowW = 3.5 - flashIn * 0.5
          glowBoost = 1 + (1 - flashIn) * 0.5
        } else {
          // Fade out
          const fade = (progress - 0.55) / 0.45
          drawProgress = 1
          alpha = 0.9 * (1 - fade)
          glowW = 3
          glowBoost = 1 - fade * 0.3
        }

        const shadowBlur = 14 * glowBoost
        const glowAlpha = alpha * 0.5 * glowBoost

        // Draw main bolt
        ctx!.strokeStyle = `rgba(0, 212, 255, ${alpha})`
        ctx!.lineWidth = glowW
        ctx!.shadowColor = `rgba(0, 212, 255, ${glowAlpha})`
        ctx!.shadowBlur = shadowBlur
        ctx!.beginPath()
        const drawLen = Math.max(2, Math.floor(b.pts.length * drawProgress))
        ctx!.moveTo(b.pts[0].x, b.pts[0].y)
        for (let j = 1; j < Math.min(drawLen, b.pts.length); j++) ctx!.lineTo(b.pts[j].x, b.pts[j].y)
        ctx!.stroke()

        // Core
        ctx!.strokeStyle = `rgba(200, 240, 255, ${alpha * 0.9})`
        ctx!.lineWidth = 1.2
        ctx!.shadowBlur = 0
        ctx!.beginPath()
        ctx!.moveTo(b.pts[0].x, b.pts[0].y)
        for (let j = 1; j < Math.min(drawLen, b.pts.length); j++) ctx!.lineTo(b.pts[j].x, b.pts[j].y)
        ctx!.stroke()

        // Draw branches (offset from main to avoid double-draw)
        for (const br of b.branches) {
          const brLen = Math.max(2, Math.floor(br.pts.length * drawProgress * 0.85))
          const ba = alpha * 0.55
          const bgw = glowW * 0.4

          ctx!.strokeStyle = `rgba(0, 212, 255, ${ba})`
          ctx!.lineWidth = bgw
          ctx!.shadowColor = `rgba(0, 212, 255, ${ba * 0.5})`
          ctx!.shadowBlur = shadowBlur * 0.4
          ctx!.beginPath()
          ctx!.moveTo(br.pts[0].x, br.pts[0].y)
          for (let j = 1; j < Math.min(brLen, br.pts.length); j++) ctx!.lineTo(br.pts[j].x, br.pts[j].y)
          ctx!.stroke()

          // Sub-branches
          for (const sub of br.subBranches) {
            const subLen = Math.max(2, Math.floor(sub.length * drawProgress * 0.7))
            ctx!.strokeStyle = `rgba(139, 92, 246, ${ba * 0.4})`
            ctx!.lineWidth = bgw * 0.5
            ctx!.shadowColor = `rgba(139, 92, 246, ${ba * 0.3})`
            ctx!.shadowBlur = shadowBlur * 0.2
            ctx!.beginPath()
            ctx!.moveTo(sub[0].x, sub[0].y)
            for (let j = 1; j < Math.min(subLen, sub.length); j++) ctx!.lineTo(sub[j].x, sub[j].y)
            ctx!.stroke()
          }
        }

        // Sparks at tip during leader phase
        if (progress < 0.3) {
          const tipIdx = Math.min(drawLen - 1, b.pts.length - 1)
          if (tipIdx > 0) {
            emitSparks(sparksRef.current, b.pts[tipIdx].x, b.pts[tipIdx].y, 3, 190)
          }
        }
      }

      // Re-draw bolts with glow for full-bolt phase (above handles it already)

      // Mouse sparks
      if (mouseRef.current.active && Math.random() > 0.5) {
        emitSparks(sparksRef.current, mouseRef.current.x, mouseRef.current.y, 3)
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
        const alpha = (1 - lr) * 0.85
        ctx!.fillStyle = `hsla(${s.hue}, 80%, 60%, ${alpha})`
        ctx!.shadowColor = `hsla(${s.hue}, 80%, 60%, 0.5)`
        ctx!.shadowBlur = 8
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, 0.8 * (1 - lr * 0.5), 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.shadowBlur = 0
    }

    // Pre-seed bolts
    for (let i = 0; i < 3; i++) {
      const origins = getCardPositions(w, h)
      if (origins.length > 0) {
        const from = origins[Math.floor(Math.random() * origins.length)]
        const to = { x: Math.random() * w, y: Math.random() * h }
        const main = fractalBolt(from, to, 0.2, 7)
        boltsRef.current.push({
          pts: main,
          branches: makeBranchesRealistic(main, 0.2, 6),
          life: Math.random() * 0.3,
          maxLife: 0.7 + Math.random() * 0.5,
          completed: false,
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

function CssFallback() {
  const linesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = linesRef.current
    if (!el) return

    function spawnLine(x: number, y: number) {
      if (!el) return
      const wrapper = document.createElement("div")
      const angle = Math.random() * Math.PI * 2
      const len = 80 + Math.random() * 200

      wrapper.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${len}px;
        height: 3px;
        transform-origin: left center;
        transform: rotate(${angle}rad);
        pointer-events: none;
        z-index: 0;
      `
      const inner = document.createElement("div")
      inner.style.cssText = `
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, rgba(0,212,255,0.95), transparent);
        box-shadow: 0 0 20px rgba(0,212,255,0.7), 0 0 40px rgba(0,212,255,0.3);
        border-radius: 2px;
        animation: cssBoltInner 0.9s ease-out forwards;
      `
      wrapper.appendChild(inner)
      el.appendChild(wrapper)
      setTimeout(() => wrapper.remove(), 700)

      if (Math.random() > 0.6) {
        const w2 = document.createElement("div")
        w2.style.cssText = wrapper.style.cssText
        w2.style.transform = `rotate(${angle + 0.3}rad)`
        const i2 = document.createElement("div")
        i2.style.cssText = `
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, rgba(139,92,246,0.8), transparent);
          box-shadow: 0 0 15px rgba(139,92,246,0.5), 0 0 30px rgba(139,92,246,0.2);
          border-radius: 2px;
          animation: cssBoltInner 0.7s ease-out forwards;
        `
        w2.appendChild(i2)
        el.appendChild(w2)
        setTimeout(() => w2.remove(), 600)
      }
    }

    function randomCardSpawn() {
      const rects = document.querySelectorAll<HTMLElement>('[class*="card"], section, article, [class*="hero"], nav, footer')
      if (rects.length === 0) return
      const r = rects[Math.floor(Math.random() * rects.length)].getBoundingClientRect()
      spawnLine(r.left + r.width * 0.5, r.top + r.height * 0.5)
      if (Math.random() > 0.5) {
        spawnLine(Math.random() * window.innerWidth, Math.random() * window.innerHeight)
      }
    }

    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => spawnLine(e.clientX, e.clientY), i * 80)
      }
    }

    let scrollTimer: ReturnType<typeof setTimeout>
    const onScroll = () => {
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(randomCardSpawn, 150)
    }

    window.addEventListener("click", onClick)
    window.addEventListener("scroll", onScroll, { passive: true })

    const natTimer = setInterval(randomCardSpawn, 2000)

    return () => {
      window.removeEventListener("click", onClick)
      window.removeEventListener("scroll", onScroll)
      clearInterval(natTimer)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div ref={linesRef} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.05),transparent_60%)] animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.03),transparent_50%)]" />
      <style>{`
        @keyframes cssBoltInner {
          0% { opacity: 1; transform: scaleX(0); }
          15% { opacity: 1; transform: scaleX(1.3); }
          35% { opacity: 0.6; transform: scaleX(1); }
          100% { opacity: 0; transform: scaleX(0.6); }
        }
      `}</style>
    </div>
  )
}

export default function ElectricEffect() {
  const [webgpu, setWebgpu] = useState<boolean | null>(null)

  useEffect(() => {
    setWebgpu(hasWebGPU())
  }, [])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  if (webgpu === null) {
    return <div className="fixed inset-0 -z-10 pointer-events-none bg-neon-blue/[0.02]" />
  }

  if (!webgpu) {
    return <CssFallback />
  }

  return <CanvasLightning onRef={(el) => { canvasRef.current = el }} />
}

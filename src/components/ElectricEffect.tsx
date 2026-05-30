import { useEffect, useRef, useState } from "react"

interface Point { x: number; y: number }
interface Bolt { pts: Point[]; branches: Point[][]; life: number; maxLife: number }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function boltPath(from: Point, to: Point, detail: number): Point[] {
  const pts: Point[] = [from]
  const segs = 8 + Math.floor(Math.random() * 6)
  for (let i = 1; i < segs; i++) {
    const t = i / segs
    const x = lerp(from.x, to.x, t) + (Math.random() - 0.5) * detail
    const y = lerp(from.y, to.y, t) + (Math.random() - 0.5) * detail * 0.6
    pts.push({ x, y })
  }
  pts.push(to)
  return pts
}

function makeBranches(main: Point[], detail: number): Point[][] {
  const branches: Point[][] = []
  const count = 2 + Math.floor(Math.random() * 3)
  for (let i = 0; i < count; i++) {
    const segIdx = Math.floor(Math.random() * (main.length - 1))
    const a = main[segIdx], b = main[segIdx + 1]
    const t = 0.3 + Math.random() * 0.4
    const origin = { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }
    const dx = b.x - a.x, dy = b.y - a.y
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const nx = -dy / len, ny = dx / len
    const side = Math.random() > 0.5 ? 1 : -1
    const angle = Math.atan2(ny * side, nx * side) + (Math.random() - 0.5) * 1.2
    const branchLen = 30 + Math.random() * 80
    const end = {
      x: origin.x + Math.cos(angle) * branchLen,
      y: origin.y + Math.sin(angle) * branchLen,
    }
    branches.push(boltPath(origin, end, detail * 0.4))
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

function emitSparks(sparks: Spark[], x: number, y: number, count: number) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 1 + Math.random() * 4
    sparks.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 0,
      maxLife: 40 + Math.random() * 60,
    })
  }
}

function drawBolt(
  ctx: CanvasRenderingContext2D,
  pts: Point[],
  alpha: number,
  glowW: number,
) {
  ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`
  ctx.lineWidth = glowW
  ctx.shadowColor = "rgba(0, 212, 255, 0.35)"
  ctx.shadowBlur = 12
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let j = 1; j < pts.length; j++) ctx.lineTo(pts[j].x, pts[j].y)
  ctx.stroke()

  ctx.strokeStyle = `rgba(180, 240, 255, ${alpha * 0.8})`
  ctx.lineWidth = 1
  ctx.shadowBlur = 0
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let j = 1; j < pts.length; j++) ctx.lineTo(pts[j].x, pts[j].y)
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
      const dist = 150 + Math.random() * 350
      const target = {
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
      }
      const main = boltPath({ x: cx, y: cy }, target, 100 + Math.random() * 60)
      boltsRef.current.push({
        pts: main,
        branches: makeBranches(main, 100),
        life: 0,
        maxLife: 1.0 + Math.random() * 0.5,
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
            const angle = Math.random() * Math.PI * 2
            const dist = 100 + Math.random() * 250
            const target = {
              x: origin.x + Math.cos(angle) * dist,
              y: origin.y + Math.sin(angle) * dist,
            }
            const main = boltPath(origin, target, 60 + Math.random() * 40)
            boltsRef.current.push({
              pts: main,
              branches: makeBranches(main, 60),
              life: 0,
              maxLife: 0.9 + Math.random() * 0.4,
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
          target = {
            x: Math.random() * w,
            y: Math.random() * h,
          }
        } else if (origins.length > 1) {
          target = origins[Math.floor(Math.random() * origins.length)]
        } else {
          target = {
            x: from.x + (Math.random() - 0.5) * 400,
            y: from.y + (Math.random() - 0.5) * 400,
          }
        }
        const main = boltPath(from, target, 80 + Math.random() * 60)
        boltsRef.current.push({
          pts: main,
          branches: makeBranches(main, 80),
          life: 0,
          maxLife: 0.8 + Math.random() * 0.7,
        })
        emitSparks(sparksRef.current, from.x, from.y, 10)
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
      const main = boltPath(from, to, 40 + Math.random() * 30)
      boltsRef.current.push({
        pts: main,
        branches: makeBranches(main, 40),
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
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

      // strong ambient glow at mouse
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

      // breathing ambient glow — stronger
      const pulse = 0.3 + 0.7 * Math.sin(t / 1800)
      ctx!.fillStyle = `rgba(0, 212, 255, ${0.025 * pulse})`
      ctx!.fillRect(0, 0, w, h)

      // purple ambient
      const pPulse = 0.3 + 0.7 * Math.sin(t / 2200 + 1)
      ctx!.fillStyle = `rgba(139, 92, 246, ${0.015 * pPulse})`
      ctx!.fillRect(0, 0, w, h)

      // natural bolts from content cards — more frequent
      boltTimer += dt
      if (boltTimer > 1.5 + Math.random() * 2) {
        spawnBolt()
        boltTimer = 0
      }

      // edge sweeps
      sweepTimer += dt
      if (sweepTimer > 2 + Math.random() * 3) {
        spawnEdgeSweep()
        sweepTimer = 0
      }

      // refresh card origins periodically
      cardRefreshTimer += dt
      if (cardRefreshTimer > 1.5) {
        cardOriginsRef.current = getCardPositions(w, h)
        cardRefreshTimer = 0
      }

      // draw bolts
      const bolts = boltsRef.current
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i]
        b.life += dt
        if (b.life >= b.maxLife) { bolts.splice(i, 1); continue }

        const progress = b.life / b.maxLife
        const alpha = (1 - progress) * 0.7
        const glowW = 1.5 + (1 - progress) * 3

        drawBolt(ctx!, b.pts, alpha, glowW)
        for (const branch of b.branches) {
          drawBolt(ctx!, branch, alpha * 0.5, glowW * 0.4)
        }

        if (progress < 0.3) {
          emitSparks(sparksRef.current, b.pts[b.pts.length - 1].x, b.pts[b.pts.length - 1].y, 6)
        }
      }

      // mouse sparks — more frequent
      if (mouseRef.current.active && Math.random() > 0.5) {
        emitSparks(sparksRef.current, mouseRef.current.x, mouseRef.current.y, 4)
      }

      // draw sparks
      const sp = sparksRef.current
      for (let i = sp.length - 1; i >= 0; i--) {
        const s = sp[i]
        s.life++
        if (s.life >= s.maxLife) { sp.splice(i, 1); continue }
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.05
        const lr = s.life / s.maxLife
        const alpha = (1 - lr) * 0.8
        ctx!.fillStyle = `rgba(0, 212, 255, ${alpha})`
        ctx!.shadowColor = "rgba(0, 212, 255, 0.5)"
        ctx!.shadowBlur = 6
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, 0.8 * (1 - lr * 0.5), 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.shadowBlur = 0
    }

    // pre-seed a few bolts
    for (let i = 0; i < 3; i++) {
      const origins = getCardPositions(w, h)
      if (origins.length > 0) {
        const from = origins[Math.floor(Math.random() * origins.length)]
        const to = { x: Math.random() * w, y: Math.random() * h }
        const main = boltPath(from, to, 80)
        boltsRef.current.push({
          pts: main,
          branches: makeBranches(main, 80),
          life: Math.random() * 0.3,
          maxLife: 0.8 + Math.random() * 0.5,
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

      // purple variant sometimes
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
      // sometimes spawn from edge
      if (Math.random() > 0.5) {
        const edgeX = Math.random() * window.innerWidth
        const edgeY = Math.random() * window.innerHeight
        spawnLine(edgeX, edgeY)
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

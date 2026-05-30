import { useEffect, useRef } from "react"

interface Point { x: number; y: number }

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function boltPoints(from: Point, to: Point, detail: number): Point[] {
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

interface Spark {
  x: number; y: number; vx: number; vy: number; life: number; maxLife: number
}

export default function ElectricEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -999, y: -999, active: false })
  const sparksRef = useRef<Spark[]>([])
  const boltsRef = useRef<{ pts: Point[]; life: number; maxLife: number }[]>([])
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
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

    let scrollY = 0
    const onScroll = () => {
      const sy = window.scrollY
      const intensity = Math.min(sy / 400, 1)
      if (sy - scrollY > 100 && intensity > 0.3) {
        const from = { x: Math.random() * w, y: 0 }
        const to = { x: from.x + (Math.random() - 0.5) * 400, y: Math.random() * h * 0.6 }
        boltsRef.current.push({
          pts: boltPoints(from, to, 80 + Math.random() * 60),
          life: 0,
          maxLife: 0.3 + Math.random() * 0.2,
        })
      }
      scrollY = sy
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    function emitSparks(x: number, y: number, count: number) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 1 + Math.random() * 3
        sparksRef.current.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          life: 0,
          maxLife: 20 + Math.random() * 30,
        })
      }
    }

    function spawnBolt() {
      const from = { x: Math.random() * w, y: Math.random() * h * 0.3 }
      const to = {
        x: from.x + (Math.random() - 0.5) * 500,
        y: from.y + 100 + Math.random() * 300,
      }
      boltsRef.current.push({
        pts: boltPoints(from, to, 40 + Math.random() * 40),
        life: 0,
        maxLife: 0.15 + Math.random() * 0.15,
      })
    }

    let boltTimer = 0

    function draw(t: number) {
      animId = requestAnimationFrame(draw)
      const dt = Math.min((t - timeRef.current) / 1000, 0.05)
      timeRef.current = t

      ctx!.clearRect(0, 0, w, h)

      // ambient energy glow at mouse
      if (mouseRef.current.active) {
        const g = ctx!.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 120,
        )
        g.addColorStop(0, "rgba(0, 212, 255, 0.06)")
        g.addColorStop(1, "rgba(0, 212, 255, 0)")
        ctx!.fillStyle = g
        ctx!.fillRect(0, 0, w, h)
      }

      // breathable ambient glow (slow pulse)
      const pulse = 0.5 + 0.5 * Math.sin(t / 2000)
      ctx!.fillStyle = `rgba(0, 212, 255, ${0.01 * pulse})`
      ctx!.fillRect(0, 0, w, h)

      // random lightning bolts
      boltTimer += dt
      if (boltTimer > 2 + Math.random() * 3) {
        spawnBolt()
        boltTimer = 0
      }

      // draw bolts
      for (let i = boltsRef.current.length - 1; i >= 0; i--) {
        const b = boltsRef.current[i]
        b.life += dt
        if (b.life >= b.maxLife) { boltsRef.current.splice(i, 1); continue }

        const progress = b.life / b.maxLife
        const alpha = (1 - progress) * 0.7
        const glowW = 6 + (1 - progress) * 12

        ctx!.strokeStyle = `rgba(0, 212, 255, ${alpha})`
        ctx!.lineWidth = glowW
        ctx!.shadowColor = "rgba(0, 212, 255, 0.5)"
        ctx!.shadowBlur = 20
        ctx!.beginPath()
        ctx!.moveTo(b.pts[0].x, b.pts[0].y)
        for (let j = 1; j < b.pts.length; j++) {
          ctx!.lineTo(b.pts[j].x, b.pts[j].y)
        }
        ctx!.stroke()

        // inner bright core
        ctx!.strokeStyle = `rgba(180, 240, 255, ${alpha * 0.8})`
        ctx!.lineWidth = 2
        ctx!.shadowBlur = 0
        ctx!.beginPath()
        ctx!.moveTo(b.pts[0].x, b.pts[0].y)
        for (let j = 1; j < b.pts.length; j++) {
          ctx!.lineTo(b.pts[j].x, b.pts[j].y)
        }
        ctx!.stroke()

        // emit sparks at the end of the bolt
        if (progress < 0.3) {
          emitSparks(b.pts[b.pts.length - 1].x, b.pts[b.pts.length - 1].y, 4)
        }
      }

      // emit sparks at mouse
      if (mouseRef.current.active && Math.random() > 0.85) {
        emitSparks(mouseRef.current.x, mouseRef.current.y, 2)
      }

      // update & draw sparks
      const sp = sparksRef.current
      for (let i = sp.length - 1; i >= 0; i--) {
        const s = sp[i]
        s.life++
        if (s.life >= s.maxLife) { sp.splice(i, 1); continue }
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.05
        const lifeRatio = s.life / s.maxLife
        const alpha = (1 - lifeRatio) * 0.8

        ctx!.fillStyle = `rgba(0, 212, 255, ${alpha})`
        ctx!.shadowColor = "rgba(0, 212, 255, 0.6)"
        ctx!.shadowBlur = 8
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, 1.5 * (1 - lifeRatio * 0.5), 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.shadowBlur = 0
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouse)
      window.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />
}

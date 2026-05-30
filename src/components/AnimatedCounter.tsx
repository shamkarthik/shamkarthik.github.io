import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

export default function AnimatedCounter({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1500
    const start = performance.now()
    let frame: number

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(eased * value))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [inView, value])

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  )
}

interface StatCardProps {
  icon: string
  value: number
  suffix?: string
  label: string
  color: string
}

export function StatCard({ icon, value, suffix, label, color }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="text-center"
    >
      <p className={`text-2xl font-bold ${color}`}>
        <AnimatedCounter value={value} suffix={suffix || "+"} />
      </p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </motion.div>
  )
}






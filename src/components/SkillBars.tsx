import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface SkillBarProps {
  name: string
  level: number
  color?: string
}

const bars: SkillBarProps[] = [
  { name: "React / React Native", level: 95, color: "bg-neon-blue" },
  { name: "Flutter", level: 85, color: "bg-cyan-400" },
  { name: "TypeScript", level: 92, color: "bg-blue-500" },
  { name: "Python", level: 80, color: "bg-yellow-500" },
  { name: "C++ / Kotlin", level: 75, color: "bg-neon-purple" },
  { name: "ONNX / Edge AI", level: 88, color: "bg-neon-green" },
  { name: "Azure / Cloud", level: 82, color: "bg-sky-500" },
  { name: "Docker / CI-CD", level: 78, color: "bg-orange-500" },
]

export default function SkillBars() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="space-y-4">
      {bars.map((bar) => (
        <div key={bar.name}>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-secondary">{bar.name}</span>
            <span className="text-muted">{bar.level}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-hover">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${bar.level}%` } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${bar.color}`}
              style={{ boxShadow: `0 0 8px ${bar.color === "bg-neon-blue" ? "rgba(0,212,255,0.4)" : bar.color === "bg-neon-green" ? "rgba(0,255,136,0.4)" : "rgba(139,92,246,0.4)"}` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}





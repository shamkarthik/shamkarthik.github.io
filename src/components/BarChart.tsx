import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface BarItem {
  label: string
  value: number
  color: string
}

export default function BarChart({ data, title, suffix = "" }: { data: BarItem[]; title?: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const max = Math.max(...data.map((d) => d.value))

  return (
    <div ref={ref}>
      {title && <h4 className="mb-4 text-sm font-semibold text-secondary">{title}</h4>}
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-secondary">{item.label}</span>
              <span className="text-muted">{item.value}{suffix}</span>
            </div>
            <div className="relative h-5 overflow-hidden rounded-lg bg-hover">
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${(item.value / max) * 100}%` } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`flex h-full items-center justify-end rounded-lg pr-2 text-xs font-medium text-black ${item.color}`}
              >
                {item.value > max * 0.3 && `${item.value}${suffix}`}
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}






import { motion } from "framer-motion"
import { experiences } from "../data/experience"

const icons: Record<string, string> = {
  "Tiger Analytics": "https://logo.clearbit.com/tigeranalytics.com",
  "Hexaware Technologies": "https://logo.clearbit.com/hexaware.com",
}

export default function Timeline() {
  return (
    <section id="experience" className="py-24">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Experience <span className="text-gradient">Timeline</span>
          </h2>
          <p className="mb-12 text-gray-400">My professional journey</p>
        </motion.div>

        <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-2rem)] before:w-[1px] before:bg-dark-border">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.role}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="relative pl-12"
            >
              <div className="absolute left-2.5 top-2 z-10 h-[15px] w-[15px] rounded-full border-2 border-neon-blue bg-[#0a0a0f]" />

              <div className="rounded-xl border border-dark-border bg-dark-card p-6 card-hover">
                <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                    <p className="text-sm text-neon-blue">{exp.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{exp.period}</p>
                    <p className="text-xs text-gray-600">{exp.location}</p>
                  </div>
                </div>

                <ul className="mb-3 space-y-1.5">
                  {exp.highlights.map((h) => (
                    <li key={h} className="text-sm leading-relaxed text-gray-400 before:mr-2 before:text-neon-blue before:content-['▹']">
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5">
                  {exp.tech.map((t) => (
                    <span key={t} className="rounded-md bg-neon-blue/5 px-2 py-0.5 text-xs text-neon-blue/80">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

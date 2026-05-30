import { motion } from "framer-motion"
import { experiences } from "../data/experience"

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
          <h2 className="mb-2 text-5xl font-bold tracking-tight sm:text-6xl">
            Experience <span className="text-gradient">Timeline</span>
          </h2>
          <p className="mb-12 text-lg text-secondary">My professional journey</p>
        </motion.div>

        <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-2rem)] before:w-[1px] before:bg-card">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.role}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
            >
              <div className="relative pl-12">
                <div className="absolute left-2.5 top-2 z-10 h-[15px] w-[15px] rounded-full border-2 border-neon-blue bg-primary" />

                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-primary">{exp.role}</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm text-neon-blue">{exp.company}</p>
                    <span className="text-xs text-muted">· {exp.period}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {exp.projects.map((proj) => (
                    <div key={proj.name} className="rounded-xl border border-card bg-card p-5 transition-all duration-300 hover:border-neon-blue/30">
                      <h4 className="mb-2 text-sm font-semibold text-secondary">{proj.name}</h4>
                      <ul className="mb-3 space-y-1.5">
                        {proj.highlights.map((h) => (
                          <li key={h} className="text-sm leading-relaxed text-secondary before:mr-2 before:text-neon-blue before:content-['▹']">
                            {h}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.tech.map((t) => (
                          <span key={t} className="rounded-md bg-neon-blue/5 px-2 py-0.5 text-xs text-neon-blue/80">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
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






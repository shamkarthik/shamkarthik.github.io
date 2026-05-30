import { motion } from "framer-motion"
import { skills, certifications, languages } from "../data/skills"
import SkillBars from "./SkillBars"

export default function SkillsSection() {
  return (
    <section id="skills" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-2 text-5xl font-bold tracking-tight sm:text-6xl">
            Technical <span className="text-gradient">Skills</span>
          </h2>
          <p className="mb-12 text-lg text-secondary">Technologies I work with daily</p>
        </motion.div>

        <div className="mb-12 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-secondary">Proficiency</h3>
            <SkillBars />
          </div>
          <div className="lg:col-span-3">
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(skills).map(([category, items], ci) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: ci * 0.1, duration: 0.4 }}
                  className="rounded-xl border border-card bg-card p-5 transition-all duration-300 hover:border-neon-blue/30"
                >
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-neon-blue">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((s) => (
                      <span key={s} className="rounded-md bg-hover px-2.5 py-1 text-xs text-secondary">
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-secondary">Certifications</h3>
            <div className="space-y-3">
              {certifications.map((c) => (
                <div key={c.title} className="rounded-lg border border-card bg-card p-4">
                  <p className="text-sm font-medium text-primary">{c.title}</p>
                  <p className="mt-1 text-xs text-muted">{c.issuer}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-secondary">Languages</h3>
            <div className="space-y-3">
              {languages.map((l) => (
                <div key={l.name} className="flex items-center justify-between rounded-lg border border-card bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-hover text-xs font-bold text-neon-blue">
                      {l.name[0]}
                    </div>
                    <p className="text-sm font-medium text-primary">{l.name}</p>
                  </div>
                  <p className="text-xs text-muted">{l.level}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}






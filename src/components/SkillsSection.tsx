import { motion } from "framer-motion"
import { skills, certifications, languages } from "../data/skills"

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
          <h2 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Technical <span className="text-gradient">Skills</span>
          </h2>
          <p className="mb-12 text-gray-400">Technologies I work with daily</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(skills).map(([category, items], ci) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.1, duration: 0.4 }}
              className="rounded-xl border border-dark-border bg-dark-card p-5 card-hover"
            >
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-neon-blue">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((s) => (
                  <span key={s} className="rounded-md bg-dark-hover px-2.5 py-1 text-xs text-gray-300">
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-300">Certifications</h3>
            <div className="space-y-3">
              {certifications.map((c) => (
                <div key={c.title} className="rounded-lg border border-dark-border bg-dark-card p-4">
                  <p className="text-sm font-medium text-white">{c.title}</p>
                  <p className="mt-1 text-xs text-gray-500">{c.issuer}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-300">Languages</h3>
            <div className="space-y-3">
              {languages.map((l) => (
                <div key={l.name} className="flex items-center justify-between rounded-lg border border-dark-border bg-dark-card p-4">
                  <p className="text-sm font-medium text-white">{l.name}</p>
                  <p className="text-xs text-gray-500">{l.level}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

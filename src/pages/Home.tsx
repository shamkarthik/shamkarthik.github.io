import Hero from "../components/Hero"
import SkillsSection from "../components/SkillsSection"
import Timeline from "../components/Timeline"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { projects } from "../data/projects"

export default function Home() {
  const featured = projects.filter((p) => p.type === "open-source" || p.type === "personal")

  return (
    <div>
      <Hero />
      <Timeline />

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Open Source & <span className="text-gradient">Projects</span>
            </h2>
            <p className="mb-12 text-gray-400">Things I've built and shared</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2">
            {featured.map((p, i) => (
              <motion.a
                key={p.title}
                href={p.url}
                target={p.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="group rounded-xl border border-dark-border bg-dark-card p-6 transition-all duration-300 hover:border-neon-blue/30"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-neon-purple">{p.type}</span>
                  <span className="text-gray-600">·</span>
                  <span className="text-xs text-gray-500">{p.title}</span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-gray-400">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="rounded-md bg-dark-hover px-2 py-0.5 text-xs text-gray-500">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.a>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/aigronomist" className="text-sm text-neon-blue transition-colors hover:text-neon-blue/80">
              View AIGronomist Features →
            </Link>
          </div>
        </div>
      </section>

      <SkillsSection />
    </div>
  )
}

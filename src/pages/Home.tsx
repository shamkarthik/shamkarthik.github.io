import { useState } from "react"
import Hero from "../components/Hero"
import SkillsSection from "../components/SkillsSection"
import Timeline from "../components/Timeline"
import { motion } from "framer-motion"
import { projects } from "../data/projects"
import { features, categories } from "../data/features"

const categoryColors: Record<string, string> = {
  "ML / AI": "border-neon-purple/30 text-neon-purple bg-neon-purple/5",
  Backend: "border-neon-blue/30 text-neon-blue bg-neon-blue/5",
  Security: "border-red-500/30 text-red-400 bg-red-500/5",
  "Data Sync": "border-yellow-500/30 text-yellow-400 bg-yellow-500/5",
  "User Features": "border-neon-green/30 text-neon-green bg-neon-green/5",
  "Core Platform": "border-orange-500/30 text-orange-400 bg-orange-500/5",
  Observability: "border-pink-500/30 text-pink-400 bg-pink-500/5",
  DevOps: "border-cyan-500/30 text-cyan-400 bg-cyan-500/5",
}

export default function Home() {
  const [showFeatures, setShowFeatures] = useState(false)
  const [activeCat, setActiveCat] = useState<string | null>(null)

  const displayed = activeCat ? features.filter((f) => f.category === activeCat) : features
  const featured = projects.filter((p) => p.type !== "work")

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
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
              AIGronomist <span className="text-gradient">Features</span>
            </h2>
            <p className="mb-2 text-gray-300">On-Device Edge AI Mobile App — Tiger Analytics</p>
            <p className="mb-8 text-sm text-gray-500">
              46 features · Flutter · BLoC · ONNX · C++ FFI · Potato disease classification
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8 rounded-xl border border-dark-border bg-dark-card p-5"
          >
            <p className="text-sm leading-relaxed text-gray-300">
              On-device CV system for potato disease classification using Vision-Language Models (VLM)
              and edge inference, reducing cloud dependency by <strong className="text-neon-green">100%</strong>.
              Custom Flutter FFI plugins, patched camera internals, and background sync with Dart isolates
              improving responsiveness by <strong className="text-neon-green">30%</strong>.
            </p>
          </motion.div>

          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className="mb-8 inline-flex items-center gap-2 rounded-lg border border-neon-blue/30 bg-neon-blue/5 px-5 py-2.5 text-sm font-medium text-neon-blue transition-all hover:bg-neon-blue/10"
          >
            {showFeatures ? "Hide" : "View"} Top 15 Features
            <svg className={`h-4 w-4 transition-transform ${showFeatures ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showFeatures && (
            <>
              <div className="mb-6 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCat(null)}
                  className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-all ${
                    !activeCat ? "border-neon-blue bg-neon-blue/10 text-neon-blue" : "border-dark-border bg-dark-card text-gray-400 hover:text-white"
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCat(c)}
                    className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-all ${
                      activeCat === c ? "border-neon-blue bg-neon-blue/10 text-neon-blue" : "border-dark-border bg-dark-card text-gray-400 hover:text-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {displayed.map((f, i) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="rounded-xl border border-dark-border bg-dark-card p-5 transition-all duration-300 hover:border-neon-blue/30"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`rounded-md border px-2.5 py-0.5 text-xs font-medium ${categoryColors[f.category] || ""}`}>
                        {f.category}
                      </span>
                      <span className="text-xs text-gray-600">#{f.id}</span>
                    </div>
                    <h3 className="mb-2 text-sm font-semibold text-white">{f.title}</h3>
                    <p className="mb-2 text-xs leading-relaxed text-gray-400">{f.description}</p>
                    <p className="text-xs text-gray-500">
                      <span className="text-neon-blue/70">Problem:</span> {f.problem}
                    </p>
                  </motion.div>
                ))}
              </div>

              <p className="mt-6 text-center text-xs text-gray-600">
                Showing {displayed.length} of {features.length} features
              </p>
            </>
          )}
        </div>
      </section>

      <SkillsSection />
    </div>
  )
}

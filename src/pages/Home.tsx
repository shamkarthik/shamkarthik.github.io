import { useState } from "react"
import Hero from "../components/Hero"
import SkillsSection from "../components/SkillsSection"
import Timeline from "../components/Timeline"
import ServiceCards from "../components/ServiceCards"
import BarChart from "../components/BarChart"
import { motion } from "framer-motion"
import { projects } from "../data/projects"
import { features, categories } from "../data/features"

const catColors: Record<string, string> = {
  "On-Device AI": "border-neon-purple/30 text-neon-purple bg-neon-purple/5",
  "Mobile Engineering": "border-neon-blue/30 text-neon-blue bg-neon-blue/5",
  "Backend Systems": "border-neon-green/30 text-neon-green bg-neon-green/5",
  Security: "border-red-500/30 text-red-400 bg-red-500/5",
  "UI / UX": "border-orange-500/30 text-orange-400 bg-orange-500/5",
  DevOps: "border-cyan-500/30 text-cyan-400 bg-cyan-500/5",
}

const catBarData = [
  { label: "On-Device AI", value: 3, color: "bg-neon-purple" },
  { label: "Mobile Engineering", value: 3, color: "bg-neon-blue" },
  { label: "Backend Systems", value: 2, color: "bg-neon-green" },
  { label: "Security", value: 2, color: "bg-red-500" },
  { label: "UI / UX", value: 2, color: "bg-orange-500" },
]

export default function Home() {
  const [activeCat, setActiveCat] = useState<string | null>(null)

  const displayed = activeCat ? features.filter((f) => f.category === activeCat) : features
  const featured = projects.filter((p) => p.type !== "work")

  return (
    <div>
      <Hero />
      <ServiceCards />
      <Timeline />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-2 text-4xl font-bold tracking-tight sm:text-6xl">
              Open Source & <span className="text-gradient">Projects</span>
            </h2>
            <p className="mb-12 text-lg text-secondary">Things I've built and shared</p>
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
                className="group rounded-xl border border-card bg-card p-6 transition-all duration-300 hover:border-neon-blue/30"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-neon-purple">{p.type}</span>
                  <span className="text-muted">·</span>
                  <span className="text-xs text-muted">{p.title}</span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-secondary">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="rounded-md bg-hover px-2 py-0.5 text-xs text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-2 text-4xl font-bold tracking-tight sm:text-6xl">
              Edge AI <span className="text-gradient">Capabilities</span>
            </h2>
            <p className="mb-2 text-secondary">High-impact engineering across on-device AI, mobile, and backend</p>
            <p className="mb-8 text-sm text-muted">
              12 core capabilities · Flutter · ONNX · C++ FFI · React Native · Azure
            </p>
          </motion.div>

          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-card bg-card p-5">
              <BarChart data={catBarData} title="Capabilities by Category" suffix="" />
            </div>
            <div className="rounded-xl border border-card bg-card p-5">
              <h4 className="mb-4 text-sm font-semibold text-secondary">Impact Metrics</h4>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { label: "Cloud Dependency", value: "100%", sub: "Reduction", color: "text-neon-green" },
                  { label: "App Responsiveness", value: "30%", sub: "Improvement", color: "text-neon-blue" },
                  { label: "Dev Velocity", value: "25%", sub: "Faster", color: "text-neon-purple" },
                  { label: "Detection Accuracy", value: "95%", sub: "Rate", color: "text-neon-green" },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg bg-hover p-4 text-center">
                    <p className={`text-lg font-bold sm:text-xl ${m.color}`}>{m.value}</p>
                    <p className="mt-0.5 text-xs text-muted">{m.sub}</p>
                    <p className="text-[10px] text-muted">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCat(null)}
              className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-all ${
                !activeCat ? "border-neon-blue bg-neon-blue/10 text-neon-blue" : "border-card bg-card text-secondary hover:text-primary"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-all ${
                  activeCat === c ? "border-neon-blue bg-neon-blue/10 text-neon-blue" : "border-card bg-card text-secondary hover:text-primary"
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="rounded-xl border border-card bg-card p-5 transition-all duration-300 hover:border-neon-blue/30"
              >
                <div className="mb-3">
                  <span className={`rounded-md border px-2.5 py-0.5 text-xs font-medium ${catColors[f.category] || ""}`}>
                    {f.category}
                  </span>
                </div>
                <h3 className="mb-2 text-sm font-semibold text-primary">{f.title}</h3>
                <p className="text-xs leading-relaxed text-secondary">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SkillsSection />
    </div>
  )
}






import { useState } from "react"
import { motion } from "framer-motion"
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

export default function AIGronomist() {
  const [activeCat, setActiveCat] = useState<string | null>(null)

  const displayed = activeCat ? features.filter((f) => f.category === activeCat) : features

  return (
    <div className="pt-24">
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-gradient">AIGronomist</span>
            </h1>
            <p className="mb-2 text-lg text-gray-300">On-Device Edge AI Mobile App — Flutter, BLoC, ONNX, C++ FFI</p>
            <p className="mb-8 text-sm text-gray-500">
              Built at Tiger Analytics · 46 features · 843 commits · Potato disease classification system
            </p>
          </motion.div>

          <div className="mb-2 rounded-xl border border-dark-border bg-dark-card p-4">
            <p className="text-sm text-gray-300">
              On-device computer vision system for potato disease classification using Vision-Language Models (VLM) and edge inference,
              reducing cloud dependency by <strong className="text-neon-green">100%</strong>. Engineered custom Flutter FFI plugins,
              patched camera internals, and implemented background sync with Dart isolates improving responsiveness by{" "}
              <strong className="text-neon-green">30%</strong>.
            </p>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
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

          <p className="mt-8 text-center text-sm text-gray-600">
            Showing {displayed.length} of {features.length} features
          </p>
        </div>
      </section>
    </div>
  )
}

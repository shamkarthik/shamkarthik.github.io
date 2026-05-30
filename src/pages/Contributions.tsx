import { motion } from "framer-motion"
import BarChart from "../components/BarChart"

const langData = [
  { label: "TypeScript", value: 42, color: "bg-blue-500" },
  { label: "Python", value: 22, color: "bg-yellow-500" },
  { label: "C++", value: 14, color: "bg-neon-purple" },
  { label: "Kotlin", value: 10, color: "bg-orange-500" },
  { label: "Dart", value: 7, color: "bg-cyan-500" },
  { label: "Other", value: 5, color: "bg-gray-500" },
]

export default function Contributions() {
  return (
    <div className="pt-24">
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl">
              GitHub <span className="text-gradient">Contributions</span>
            </h1>
            <p className="mb-12 text-gray-400">84 contributions in the last year · 26 repositories</p>
          </motion.div>

          <div className="mb-8 grid gap-4 sm:grid-cols-4">
            {[
              { label: "Total Repos", value: "26", color: "text-neon-blue", desc: "Public repositories" },
              { label: "Stars", value: "8", color: "text-yellow-500", desc: "Across all repos" },
              { label: "Followers", value: "6", color: "text-neon-green", desc: "GitHub community" },
              { label: "Following", value: "5", color: "text-neon-purple", desc: "Developers" },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-xl border border-dark-border bg-dark-card p-5 text-center"
              >
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-xs text-gray-500">{s.label}</p>
                <p className="text-[10px] text-gray-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="rounded-xl border border-dark-border bg-dark-card p-5"
            >
              <BarChart data={langData} title="Language Distribution" suffix="%" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="overflow-hidden rounded-xl border border-dark-border bg-dark-card p-4"
            >
              <h4 className="mb-4 text-sm font-semibold text-gray-300">Contribution Graph</h4>
              <img
                src="https://ghchart.rshah.org/shamkarthik"
                alt="GitHub Contribution Chart"
                className="w-full"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
              />
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-600">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#ebedf0] opacity-20" />
                <span className="h-2.5 w-2.5 rounded-sm bg-[#9be9a8] opacity-30" />
                <span className="h-2.5 w-2.5 rounded-sm bg-[#40c463] opacity-50" />
                <span className="h-2.5 w-2.5 rounded-sm bg-[#30a14e] opacity-70" />
                <span className="h-2.5 w-2.5 rounded-sm bg-[#216e39]" />
                <span className="ml-2">Less</span>
                <span className="ml-1">More</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-xl border border-dark-border bg-dark-card p-6"
          >
            <h3 className="mb-4 text-sm font-semibold text-gray-300">Recent Activity</h3>
            <div className="space-y-2">
              {[
                { repo: "connect.me", desc: "Forked from Arunkumarvallal/connect.me", date: "27 days ago", type: "fork" },
                { repo: "shamkarthik", desc: "Updated profile README", date: "28 days ago", type: "push" },
                { repo: "perplexity-web-wrapper", desc: "Forked from saiteja-madha/perplexity-web-wrapper", date: "Feb 2026", type: "fork" },
                { repo: "extension", desc: "Browser extension development", date: "Jan 2026", type: "push" },
                { repo: "react-native-nitro-opencv", desc: "OpenCV integration for React Native", date: "Dec 2025", type: "push" },
              ].map((a) => (
                <div key={a.repo} className="flex items-center justify-between rounded-lg bg-dark-hover px-4 py-3 transition-colors hover:bg-dark-hover/80">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-6 w-6 items-center justify-center rounded text-[10px] ${a.type === "fork" ? "bg-blue-500/10 text-blue-400" : "bg-neon-green/10 text-neon-green"}`}>
                      {a.type === "fork" ? "⑂" : "↑"}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{a.repo}</p>
                      <p className="text-xs text-gray-500">{a.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600">{a.date}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

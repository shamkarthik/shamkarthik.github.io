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

const repoStats = [
  { repo: "portfolio", desc: "Portfolio website — React 19 + Vite", date: "Now", type: "push" },
  { repo: "connect.me", desc: "Forked from Arunkumarvallal/connect.me", date: "27 days ago", type: "fork" },
  { repo: "shamkarthik", desc: "Updated profile README", date: "28 days ago", type: "push" },
  { repo: "perplexity-web-wrapper", desc: "Forked from saiteja-madha/perplexity-web-wrapper", date: "Feb 2026", type: "fork" },
  { repo: "extension", desc: "Browser extension development", date: "Jan 2026", type: "push" },
]

export default function Contributions() {
  return (
    <div className="pt-24">
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-6xl lg:text-6xl">
              GitHub <span className="text-gradient">Contributions</span>
            </h1>
            <p className="mb-12 text-lg text-secondary">84 contributions in the last year · 26 repositories</p>
          </motion.div>

          <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
            {[
              { label: "Total Repos", value: "26", color: "text-neon-blue", desc: "Public repositories" },
              { label: "Stars Earned", value: "8", color: "text-yellow-500", desc: "Across all repos" },
              { label: "Followers", value: "6", color: "text-neon-green", desc: "GitHub community" },
              { label: "Following", value: "5", color: "text-neon-purple", desc: "Developers" },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-xl border border-card bg-card p-5 text-center"
              >
                <p className={`text-2xl font-bold sm:text-3xl ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-sm text-muted">{s.label}</p>
                <p className="text-xs text-muted">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mb-8 grid gap-6 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="rounded-xl border border-card bg-card p-5 lg:col-span-1"
            >
              <BarChart data={langData} title="Language Distribution" suffix="%" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="overflow-hidden rounded-xl border border-card bg-card p-5 lg:col-span-2"
            >
              <h4 className="mb-4 text-sm font-semibold text-secondary">Contribution Graph (Last Year)</h4>
              <img
                src="https://ghchart.rshah.org/shamkarthik"
                alt="GitHub Contribution Chart"
                className="w-full max-w-2xl"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
              />
              <div className="mt-3 flex items-center gap-1 text-xs text-muted">
                <span className="mr-1">Less</span>
                <span className="h-3 w-3 rounded-sm bg-[#ebedf0] opacity-20" />
                <span className="h-3 w-3 rounded-sm bg-[#9be9a8] opacity-30" />
                <span className="h-3 w-3 rounded-sm bg-[#40c463] opacity-50" />
                <span className="h-3 w-3 rounded-sm bg-[#30a14e] opacity-70" />
                <span className="h-3 w-3 rounded-sm bg-[#216e39]" />
                <span className="ml-1">More</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-xl border border-card bg-card p-6"
          >
            <h3 className="mb-4 text-base font-semibold text-secondary">Recent Activity</h3>
            <div className="space-y-2">
              {repoStats.map((a) => (
                <div key={a.repo} className="flex items-center justify-between rounded-lg bg-hover px-4 py-3 transition-colors hover:bg-primary">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-7 w-7 items-center justify-center rounded text-xs ${a.type === "fork" ? "bg-blue-500/10 text-blue-400" : "bg-neon-green/10 text-neon-green"}`}>
                      {a.type === "fork" ? "⑂" : "↑"}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-primary">{a.repo}</p>
                      <p className="text-xs text-muted">{a.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted">{a.date}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}



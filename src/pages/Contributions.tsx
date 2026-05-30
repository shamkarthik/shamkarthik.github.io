import { motion } from "framer-motion"

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

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total Repos", value: "26", color: "text-neon-blue" },
              { label: "Commits %", value: "97%", color: "text-neon-green" },
              { label: "PRs %", value: "3%", color: "text-neon-purple" },
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
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8 overflow-hidden rounded-xl border border-dark-border bg-dark-card p-4"
          >
            <img
              src="https://ghchart.rshah.org/shamkarthik"
              alt="GitHub Contribution Chart"
              className="w-full"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
            />
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-600">
              <span className="h-2 w-2 rounded-sm bg-[#ebedf0] opacity-20" />
              <span className="h-2 w-2 rounded-sm bg-[#9be9a8] opacity-30" />
              <span className="h-2 w-2 rounded-sm bg-[#40c463] opacity-50" />
              <span className="h-2 w-2 rounded-sm bg-[#30a14e] opacity-70" />
              <span className="h-2 w-2 rounded-sm bg-[#216e39]" />
              <span className="ml-1">Contributions (last year)</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-xl border border-dark-border bg-dark-card p-6"
          >
            <h3 className="mb-4 text-sm font-semibold text-gray-300">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { repo: "connect.me", desc: "Forked from Arunkumarvallal/connect.me", date: "27 days ago" },
                { repo: "shamkarthik", desc: "Profile README", date: "28 days ago" },
                { repo: "perplexity-web-wrapper", desc: "Forked from saiteja-madha/perplexity-web-wrapper", date: "Feb 2026" },
                { repo: "extension", desc: "Browser extension", date: "Jan 2026" },
                { repo: "react-native-nitro-opencv", desc: "OpenCV integration for React Native", date: "Dec 2025" },
              ].map((a) => (
                <div key={a.repo} className="flex items-center justify-between rounded-lg bg-dark-hover px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{a.repo}</p>
                    <p className="text-xs text-gray-500">{a.desc}</p>
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

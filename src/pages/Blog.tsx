import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Article {
  title: string
  link: string
  pubDate: string
  description: string
  categories: string[]
  thumbnail: string
}

type Tab = "medium" | "linkedin"

export default function Blog() {
  const [tab, setTab] = useState<Tab>("medium")
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (tab !== "medium") return
    setLoading(true)
    fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@shamkarthik88")
      .then((r) => r.json())
      .then((data) => {
        if (data.items) setArticles(data.items)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [tab])

  return (
    <div className="pt-24">
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-6xl">
              Blog & <span className="text-gradient">Articles</span>
            </h1>
            <p className="mb-8 text-lg text-secondary">My writings on Medium and LinkedIn</p>
          </motion.div>

          <div className="mb-8 flex gap-2">
            <button
              onClick={() => setTab("medium")}
              className={`rounded-lg border px-5 py-2 text-sm font-medium transition-all ${
                tab === "medium"
                  ? "border-neon-blue bg-neon-blue/10 text-neon-blue"
                  : "border-card bg-card text-secondary hover:text-primary"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M0 0v24h24V0H0zm19.938 5.686L18.651 6.92a.376.376 0 00-.143.362v9.067a.376.376 0 00.143.362l1.257 1.234v.271h-6.322v-.27l1.302-1.265c.128-.128.128-.165.128-.361V8.99l-3.62 9.195h-.49L6.69 8.99v6.163a.85.85 0 00.234.707l1.694 2.054v.271H3.815v-.27l1.694-2.054a.82.82 0 00.234-.707V8.075a.624.624 0 00-.203-.532L4.025 5.686v-.27h4.674l3.613 7.923 3.176-7.924h4.456l-.006.271z"/></svg>
                Medium
              </span>
            </button>
            <button
              onClick={() => setTab("linkedin")}
              className={`rounded-lg border px-5 py-2 text-sm font-medium transition-all ${
                tab === "linkedin"
                  ? "border-neon-blue bg-neon-blue/10 text-neon-blue"
                  : "border-card bg-card text-secondary hover:text-primary"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn Posts
              </span>
            </button>
          </div>

          {tab === "medium" && (
            <>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon-blue border-t-transparent" />
                </div>
              ) : articles.length === 0 ? (
                <div className="rounded-xl border border-card bg-card p-8 text-center">
                  <p className="text-muted">No articles found. Check back later.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {articles.map((article, i) => (
                    <motion.a
                      key={article.link}
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      className="block rounded-xl border border-card bg-card p-6 transition-all duration-300 hover:border-neon-blue/30"
                    >
                      <div className="mb-3 flex items-center gap-3 text-xs text-muted">
                        <span>{new Date(article.pubDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                        {article.categories.length > 0 && (
                          <>
                            <span>·</span>
                            <div className="flex gap-1.5">
                              {article.categories.map((c) => (
                                <span key={c} className="rounded-md bg-hover px-2 py-0.5 text-xs text-secondary">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      <h2 className="mb-2 text-lg font-semibold text-primary transition-colors group-hover:text-neon-blue">
                        {article.title}
                      </h2>
                      <p
                        className="line-clamp-2 text-sm leading-relaxed text-secondary"
                        dangerouslySetInnerHTML={{
                          __html: article.description.replace(/<[^>]+>/g, "").slice(0, 200) + "...",
                        }}
                      />
                      <div className="mt-3 flex items-center gap-1 text-xs text-neon-blue">
                        Read on Medium
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}

              <div className="mt-8 text-center">
                <a
                  href="https://medium.com/@shamkarthik88"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
                >
                  View all on Medium
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </>
          )}

          {tab === "linkedin" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-xl border border-card bg-card p-8 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neon-blue/10">
                  <svg className="h-10 w-10 text-neon-blue" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-primary">LinkedIn Activity</h3>
                <p className="mb-6 text-sm text-secondary">
                  LinkedIn doesn't offer a public feed embed. Visit Sham's LinkedIn profile to see his latest posts and activity.
                </p>
                <a
                  href="https://www.linkedin.com/in/sham-karthik-s/recent-activity/"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-neon-blue px-6 py-3 text-sm font-medium text-black transition-all duration-200 hover:bg-neon-blue/90 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  View LinkedIn Activity
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

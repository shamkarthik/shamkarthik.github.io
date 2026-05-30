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

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@shamkarthik88")
      .then((r) => r.json())
      .then((data) => {
        if (data.items) setArticles(data.items)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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
            <p className="mb-12 text-lg text-secondary">My writings on Medium about tech, AI, and privacy</p>
          </motion.div>

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
        </div>
      </section>
    </div>
  )
}






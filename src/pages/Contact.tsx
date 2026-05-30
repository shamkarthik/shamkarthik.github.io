import { motion } from "framer-motion"

export default function Contact() {
  return (
    <div className="pt-24">
      <section className="py-12">
        <div className="mx-auto max-w-2xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-6xl">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="mb-8 text-lg text-secondary">Have a question or want to collaborate? Reach out directly.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-xl border border-card bg-card p-8 text-center"
          >
            <p className="mb-8 text-secondary">Feel free to DM me on LinkedIn or send an email — I usually respond within a day.</p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="mailto:shamkarthik88@gmail.com"
                className="inline-flex items-center gap-3 rounded-lg bg-neon-blue px-8 py-4 font-medium text-black transition-all duration-200 hover:bg-neon-blue/90 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send an Email
              </a>
              <a
                href="https://www.linkedin.com/in/sham-karthik-s/"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-lg border border-neon-blue/30 px-8 py-4 font-medium text-neon-blue transition-all duration-200 hover:bg-neon-blue/10"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                DM on LinkedIn
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6"
          >
            <div className="rounded-xl border border-card bg-card p-6 text-center">
              <p className="mb-4 text-sm text-secondary">View or download my resume to learn more about my experience.</p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <a
                  href="/one_page.pdf"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-neon-purple px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-neon-purple/90 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Resume
                </a>
                <a
                  href="/one_page.pdf"
                  download
                  className="inline-flex items-center gap-2 rounded-lg border border-neon-purple/30 px-6 py-3 text-sm font-medium text-neon-purple transition-all duration-200 hover:bg-neon-purple/10"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Resume
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12"
          >
            <div className="rounded-xl border border-card bg-card p-6">
              <h3 className="mb-4 text-sm font-semibold text-secondary">Connect with me</h3>
              <div className="space-y-3">
                {[
                  { label: "Email", value: "shamkarthik88@gmail.com", href: "mailto:shamkarthik88@gmail.com" },
                  { label: "LinkedIn", value: "linkedin.com/in/sham-karthik-s", href: "https://linkedin.com/in/sham-karthik-s" },
                  { label: "GitHub", value: "github.com/shamkarthik", href: "https://github.com/shamkarthik" },
                  { label: "Medium", value: "medium.com/@shamkarthik88", href: "https://medium.com/@shamkarthik88" },
                ].map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-start gap-0.5 rounded-lg bg-hover px-4 py-3 text-sm transition-colors hover:bg-hover/80 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-xs text-muted sm:text-sm">{c.label}</span>
                    <span className="break-all text-xs text-secondary sm:text-sm">{c.value}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}






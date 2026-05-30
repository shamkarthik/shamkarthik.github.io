import { motion } from "framer-motion"
import { useState } from "react"
import { StatCard } from "./AnimatedCounter"

export default function Hero() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("shamkarthik88@gmail.com")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="glow-blue relative h-32 w-32 overflow-hidden rounded-full border-2 border-neon-blue/30 sm:h-40 sm:w-40">
            <img
              src="https://avatars.githubusercontent.com/u/53367916?v=4"
              alt="Sham Karthik S"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon-blue/20 bg-neon-blue/5 px-5 py-2 text-base text-neon-blue">
          <span className="h-2 w-2 animate-pulse rounded-full bg-neon-green" />
          Senior AI/ML Engineer @ Tiger Analytics
        </div>

        <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
          Sham{" "}
          <span className="text-gradient">Karthik S</span>
        </h1>

        <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-secondary sm:text-2xl">
          On-device AI · Edge Inference · Cross-Platform Native
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="https://linkedin.com/in/sham-karthik-s"
            target="_blank" rel="noopener noreferrer"
            className="rounded-lg bg-neon-blue px-6 py-3 font-medium text-black transition-all duration-200 hover:bg-neon-blue/90 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]"
          >
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              Connect on LinkedIn
            </span>
          </a>
          <a
            href="https://github.com/shamkarthik"
            target="_blank" rel="noopener noreferrer"
            className="rounded-lg border border-card bg-card px-6 py-3 font-medium text-secondary transition-all duration-200 hover:border-gray-600 hover:text-primary"
          >
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GitHub Profile
            </span>
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-4 text-base"
        >
          <div className="inline-flex items-center gap-2 rounded-lg border border-card bg-card px-4 py-2">
            <svg className="h-4 w-4 text-neon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-secondary">shamkarthik88@gmail.com</span>
            <button
              onClick={copyEmail}
              className="ml-1 rounded-md p-1.5 text-muted transition-all hover:bg-hover hover:text-neon-blue"
              title="Copy email"
            >
              {copied ? (
                <svg className="h-4 w-4 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
          <a href="https://medium.com/@shamkarthik88" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-card bg-card px-4 py-2 text-secondary transition-all hover:border-gray-600 hover:text-primary">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M0 0v24h24V0H0zm19.938 5.686L18.651 6.92a.376.376 0 00-.143.362v9.067a.376.376 0 00.143.362l1.257 1.234v.271h-6.322v-.27l1.302-1.265c.128-.128.128-.165.128-.361V8.99l-3.62 9.195h-.49L6.69 8.99v6.163a.85.85 0 00.234.707l1.694 2.054v.271H3.815v-.27l1.694-2.054a.82.82 0 00.234-.707V8.075a.624.624 0 00-.203-.532L4.025 5.686v-.27h4.674l3.613 7.923 3.176-7.924h4.456l-.006.271z"/></svg>
            Medium
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-16 grid w-full max-w-lg grid-cols-2 gap-8 border-t border-card pt-10"
      >
        <StatCard icon="calendar" value={5} suffix="+" label="Years Experience" color="text-neon-blue" />
        <StatCard icon="award" value={15} suffix="+" label="Projects Delivered" color="text-neon-purple" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-xs text-muted">
          <span>Scroll</span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-neon-blue to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}

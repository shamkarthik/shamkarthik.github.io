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
            <p className="mb-12 text-lg text-secondary">Have a question or want to collaborate?</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            action="https://formsubmit.co/shamkarthik88@gmail.com"
            method="POST"
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full rounded-lg border border-card bg-card px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="w-full rounded-lg border border-card bg-card px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20"
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="w-full rounded-lg border border-card bg-card px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              required
              className="w-full resize-none rounded-lg border border-card bg-card px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-neon-blue px-6 py-3 font-medium text-black transition-all duration-200 hover:bg-neon-blue/90 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]"
            >
              Send Message
            </button>
          </motion.form>

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






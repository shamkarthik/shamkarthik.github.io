import { motion } from "framer-motion"

const services = [
  {
    title: "AI / ML Engineering",
    desc: "On-device inference, VLMs, edge deployment with ONNX & TFLite",
    color: "text-neon-purple",
    border: "border-neon-purple/20",
    hover: "group-hover:bg-neon-purple/5",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    title: "Full-Stack Web",
    desc: "React, TypeScript, Node.js, Tailwind — pixel-perfect UIs to scalable APIs",
    color: "text-neon-blue",
    border: "border-neon-blue/20",
    hover: "group-hover:bg-neon-blue/5",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    title: "Cross-Platform Mobile",
    desc: "Flutter, Kotlin Multiplatform — native-feel apps with shared business logic",
    color: "text-neon-green",
    border: "border-neon-green/20",
    hover: "group-hover:bg-neon-green/5",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
  {
    title: "Backend & DevOps",
    desc: "Rust, Go, microservices, CI/CD pipelines, and cloud infrastructure",
    color: "text-orange-400",
    border: "border-orange-400/20",
    hover: "group-hover:bg-orange-500/5",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
]

export default function ServiceCards() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-2 text-4xl font-bold tracking-tight sm:text-6xl">
            What I <span className="text-gradient">Do</span>
          </h2>
          <p className="mb-12 text-lg text-secondary">Engineering across the full stack</p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`group rounded-xl border ${s.border} bg-card p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${s.hover}`}
            >
              <div className={`mb-4 ${s.color}`}>{s.icon}</div>
              <h3 className={`mb-2 text-base font-semibold ${s.color}`}>{s.title}</h3>
              <p className="text-sm leading-relaxed text-secondary">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 rounded-xl border border-neon-blue/30 bg-gradient-to-r from-neon-blue/[0.08] via-neon-purple/[0.04] to-neon-blue/[0.08] px-8 py-5 text-base shadow-[0_0_40px_rgba(0,212,255,0.12)] sm:text-lg">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neon-blue/10">
              <svg className="h-5 w-5 text-neon-blue" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L4.093 12.687a.75.75 0 00.553 1.313H12l-1 8 8.907-10.687A.75.75 0 0019.354 10H12l1-8z"/>
              </svg>
            </div>
            <span className="text-white font-semibold">
              "Run, Barry. Run." — <span className="text-neon-blue font-bold">That's the energy I bring to every project.</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

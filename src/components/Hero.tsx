import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { StatCard } from "./AnimatedCounter"

export default function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon-blue/20 bg-neon-blue/5 px-4 py-1.5 text-sm text-neon-blue">
          <span className="h-2 w-2 animate-pulse rounded-full bg-neon-green" />
          Senior AI/ML Engineer @ Tiger Analytics
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Sham{" "}
          <span className="text-gradient">Karthik S</span>
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-gray-400">
          Building on-device AI systems, computer vision pipelines, and cross-platform mobile experiences.
          Specializing in edge inference, native modules, and production mobile apps.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="https://linkedin.com/in/sham-karthik-s"
            target="_blank" rel="noopener noreferrer"
            className="rounded-lg border border-dark-border bg-dark-card px-6 py-3 font-medium text-gray-300 transition-all duration-200 hover:border-gray-600 hover:text-white"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/shamkarthik"
            target="_blank" rel="noopener noreferrer"
            className="rounded-lg border border-dark-border bg-dark-card px-6 py-3 font-medium text-gray-300 transition-all duration-200 hover:border-gray-600 hover:text-white"
          >
            GitHub
          </a>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          {["React / React Native", "Flutter", "ONNX / Edge AI", "OpenCV", "C++ / Kotlin"].map((s) => (
            <span key={s} className="rounded-full border border-dark-border px-3 py-1">
              {s}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-16 grid w-full max-w-2xl grid-cols-3 gap-8 border-t border-dark-border pt-10"
      >
        <StatCard icon="calendar" value={5} suffix="+" label="Years Experience" color="text-neon-blue" />
        <StatCard icon="code" value={26} suffix="+" label="Repositories" color="text-neon-green" />
        <StatCard icon="award" value={15} suffix="+" label="Projects Delivered" color="text-neon-purple" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-xs text-gray-600">
          <span>Scroll</span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-neon-blue to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}

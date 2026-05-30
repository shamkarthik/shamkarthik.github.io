import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import ThemeToggle from "./ThemeToggle"

const links = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Blog" },
  { to: "/contributions", label: "Contributions" },
  { to: "/contact", label: "Contact" },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-card bg-primary/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 sm:px-4">
        <Link to="/" className="shrink-0 text-sm font-bold tracking-wide text-gradient sm:text-lg whitespace-nowrap">
          SHAM KARTHIK S
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-full bg-hover/50 p-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`relative rounded-full px-4 py-1.5 text-sm transition-all duration-300 ${
                  pathname === l.to
                    ? "text-primary"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {pathname === l.to && (
                  <span className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,212,255,0.15)]" />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            ))}
          </div>
          <ThemeToggle />
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-card bg-primary/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`relative rounded-lg px-4 py-3 text-sm transition-all ${
                  pathname === l.to ? "text-black" : "text-secondary hover:text-primary"
                }`}
              >
                {pathname === l.to && (
                  <span className="absolute inset-0 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,212,255,0.15)]" />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}






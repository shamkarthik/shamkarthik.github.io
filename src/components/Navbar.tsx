import { Link, useLocation } from "react-router-dom"
import { useState } from "react"

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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-dark-border bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-bold tracking-wide text-gradient">
          SHAM KARTHIK S
        </Link>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-lg px-4 py-2 text-sm transition-all duration-200 ${
                pathname === l.to ? "bg-neon-blue/10 text-neon-blue" : "text-gray-400 hover:bg-dark-hover hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {open && (
        <div className="border-t border-dark-border bg-[#0a0a0f]/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm transition-all ${
                  pathname === l.to ? "bg-neon-blue/10 text-neon-blue" : "text-gray-400 hover:bg-dark-hover hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

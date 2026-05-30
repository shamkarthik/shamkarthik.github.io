import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "dark" | "light"

const ThemeContext = createContext({ theme: "dark" as Theme, toggle: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme")
      if (saved === "light" || saved === "dark") return saved
    }
    return "dark"
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"))

  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>
}

export function useTheme() {
  return useContext(ThemeContext)
}





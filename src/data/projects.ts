export interface Project {
  title: string
  description: string
  tech: string[]
  url: string
  type: "work" | "open-source" | "personal"
}

export const projects: Project[] = [
  {
    title: "TLDR-ON",
    description: "Chrome/Edge extension that summarizes LinkedIn posts and articles using Google Gemini API, saving 70% of reading time. Includes promoted content filtering.",
    tech: ["React", "Gemini API", "Browser Extensions"],
    url: "https://github.com/shamkarthik/tldron",
    type: "personal",
  },
  {
    title: "PayFinder",
    description: "Cross-browser extension for finding salary estimates from survey data collected from review sites. Processes 1000+ salary data points.",
    tech: ["React", "Web Scraping", "Browser Extensions"],
    url: "https://github.com/shamkarthik/payfynder",
    type: "personal",
  },
]

export interface Project {
  title: string
  description: string
  tech: string[]
  url: string
  type: "work" | "open-source" | "personal"
}

export const projects: Project[] = [
  {
    title: "react-native-nitro-opencv",
    description: "High-performance OpenCV integration for React Native using Nitro Native Modules. Enables native OpenCV operations with zero JS bridge overhead.",
    tech: ["TypeScript", "OpenCV", "C++", "React Native"],
    url: "https://github.com/shamkarthik/react-native-nitro-opencv",
    type: "open-source",
  },
  {
    title: "react-native-nitro-cam",
    description: "High-performance camera module for React Native with native optimizations, written in Kotlin and Swift.",
    tech: ["Kotlin", "Swift", "React Native"],
    url: "https://github.com/shamkarthik/react-native-nitro-cam",
    type: "open-source",
  },
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

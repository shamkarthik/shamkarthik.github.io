export interface Project {
  title: string
  description: string
  tech: string[]
  url: string
  type: "work" | "open-source" | "personal"
}

export const projects: Project[] = [
  {
    title: "AIGronomist",
    description: "On-device computer vision system for potato disease classification using Vision-Language Models and edge inference, reducing cloud dependency by 100%.",
    tech: ["Flutter", "BLoC", "ONNX Runtime", "C++ FFI", "Azure", "Django", "OpenCV"],
    url: "#aigronomist",
    type: "work",
  },
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
    description: "Cross-browser extension for finding salary estimates from survey data on employer review sites. Processes 1000+ salary data points.",
    tech: ["React", "Web Scraping", "Browser Extensions"],
    url: "https://github.com/shamkarthik/payfynder",
    type: "personal",
  },
  {
    title: "PepIris — On-Device CV",
    description: "Fraud photo detection using OpenCV and sensor fusion with 95% accuracy. Panorama generation from video streams using stitching algorithms.",
    tech: ["React Native", "C++ Turbo Modules", "OpenCV", "ONNX"],
    url: "#",
    type: "work",
  },
]

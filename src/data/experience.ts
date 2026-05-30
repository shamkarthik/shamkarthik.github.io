export interface Experience {
  role: string
  company: string
  period: string
  location: string
  projects: {
    name: string
    tech: string[]
    highlights: string[]
  }[]
}

export const experiences: Experience[] = [
  {
    role: "Senior AI/ML Engineer",
    company: "Tiger Analytics",
    period: "Jan 2023 – Present",
    location: "Chennai, India",
    projects: [
      {
        name: "AIGronomist",
        tech: ["Flutter", "BLoC", "ONNX", "FFI Plugin", "GitHub Copilot", "OpenCV"],
        highlights: [
          "On-device CV system for potato disease classification using VLM & edge inference, reducing cloud dependency by 100%",
          "Custom Flutter FFI plugins and patched camera internals for low-latency native hardware access",
          "Background upload with Dart isolates for concurrent processing, improving responsiveness by 30%",
          "Figma MCP with Copilot-driven workflow, accelerating UI implementation by 25%",
        ],
      },
      {
        name: "Mobile R&D — GenAI",
        tech: ["Kotlin", "Java", "React Native", "ExecuTorch", "Llama", "MLC LLM", "Turso"],
        highlights: [
          "Built on-device LLM inference SDK for Android supporting ExecuTorch and MLC LLM engines",
          "Integrated Gemma and Llama model families with RAG pipeline using Turso embedded database",
          "Optimized token generation throughput by 35% through NPU/GPU delegation and quantization",
        ],
      },
      {
        name: "PepIris — On-Device CV",
        tech: ["React Native", "C++ Turbo Modules", "OpenCV", "ONNX", "VisionCamera"],
        highlights: [
          "Fraud photo detection using computer vision and sensor fusion with 95% accuracy",
          "Panorama image generation from video streams using stitching algorithms",
          "Improved application performance by 20% through profiling and optimization",
          "RN New Architecture Turbo Native modules, VisionCamera, and ONNX model integration",
        ],
      },
      {
        name: "Innovation Incrementality V2",
        tech: ["React", "TypeScript", "Docker", "Ant Design", "Redux Toolkit"],
        highlights: [
          "Redesigned Analytics Dashboard supporting 5+ international markets with i18n implementation",
          "Developed 10+ reusable components with configurable UI for multi-market adaptability",
          "Integrated SSO with Microsoft O365, improving authentication efficiency by 15%",
        ],
      },
      {
        name: "App Templates",
        tech: ["React", "TypeScript", "Docker", "MUI", "Redux Toolkit"],
        highlights: [
          "Created production-ready templates, accelerating new project development by 30%",
          "Built 10+ reusable components compatible with Ant Design and MUI, optimized for React Hook Form",
          "Resolved 5+ critical bugs and authored detailed documentation for streamlined onboarding",
        ],
      },
    ],
  },
  {
    role: "Software Engineer",
    company: "Hexaware Technologies",
    period: "Jan 2021 – Jan 2023",
    location: "Chennai, India",
    projects: [
      {
        name: "RapidX",
        tech: ["TypeScript", "NestJS", "React", "Azure", "MongoDB", ".NET", "Docker"],
        highlights: [
          "Architected 4+ microservices with NestJS, optimizing JWT authorization for 40% security/scalability improvement",
          "Created CI/CD automation microservice for YAML generation, streamlining deployments",
          "Led code reviews and JMeter performance testing, boosting throughput by 30%",
        ],
      },
      {
        name: "Automaton",
        tech: ["Python", "Angular", "JavaScript", "MariaDB", "Electron", "Pywinauto"],
        highlights: [
          "Redesigned authentication with switchable SSO, LDAP, and DB login options, reducing login time by 15%",
          "Built custom DevOps tool to manage RPA scripts across environments",
          "Resolved 70+ critical bugs and rewrote Pywinauto code blocks, enhancing RPA task efficiency by 20%",
        ],
      },
    ],
  },
]

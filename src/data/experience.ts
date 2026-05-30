export interface Experience {
  role: string
  company: string
  period: string
  location: string
  highlights: string[]
  tech: string[]
}

export const experiences: Experience[] = [
  {
    role: "Senior AI/ML Engineer",
    company: "Tiger Analytics",
    period: "Jan 2023 – Present",
    location: "Chennai, India",
    tech: ["Flutter", "BLoC", "ONNX", "FFI Plugin", "GitHub Copilot"],
    highlights: [
      "Developed on-device CV system for potato disease classification using VLM & edge inference, reducing cloud dependency by 100%",
      "Engineered custom Flutter FFI plugins and patched Flutter camera internals for low-latency native hardware access",
      "Implemented background upload with Dart isolates for concurrent processing, improving responsiveness by 30%",
      "Integrated Figma MCP with Copilot-driven workflow, accelerating UI implementation by 25%",
    ],
  },
  {
    role: "Mobile R&D Engineer — GenAI",
    company: "Tiger Analytics",
    period: "Jan 2023 – Present",
    location: "Chennai, India",
    tech: ["Kotlin", "Java", "React Native", "ExecuTorch", "Llama", "MLC LLM", "Turso"],
    highlights: [
      "Built on-device LLM inference SDK for Android supporting ExecuTorch and MLC LLM engines",
      "Integrated Gemma and Llama model families with RAG pipeline using Turso embedded database",
      "Optimized token generation throughput by 35% through NPU/GPU delegation and quantization",
    ],
  },
  {
    role: "Software Engineer",
    company: "Hexaware Technologies",
    period: "Jan 2021 – Jan 2023",
    location: "Chennai, India",
    tech: ["TypeScript", "NestJS", "React", "Azure", "MongoDB", ".NET", "Docker"],
    highlights: [
      "Architected 4+ microservices with NestJS, optimizing JWT authorization for 40% security/scalability improvement",
      "Developed CI/CD automation microservice for YAML generation, streamlining deployments",
      "Led code reviews and JMeter performance testing, boosting throughput by 30%",
    ],
  },
]

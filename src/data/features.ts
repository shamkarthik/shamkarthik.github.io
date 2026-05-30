export interface Feature {
  id: number
  title: string
  category: string
  description: string
}

export const categories = [
  "On-Device AI",
  "Mobile Engineering",
  "Backend Systems",
  "Security",
  "UI / UX",
  "DevOps",
] as const

export const features: Feature[] = [
  {
    id: 1,
    title: "On-Device ML Inference Engine",
    category: "On-Device AI",
    description: "Edge inference pipeline with hardware acceleration, reducing cloud dependency and enabling real-time predictions on-device",
  },
  {
    id: 2,
    title: "Multi-Model Orchestration",
    category: "On-Device AI",
    description: "Seamless switching between model variants with fallback support, version management, and over-the-air model updates",
  },
  {
    id: 3,
    title: "Vision Pipeline with VLMs",
    category: "On-Device AI",
    description: "Vision-Language Models for detection, segmentation, and classification — fully on-device with high accuracy",
  },
  {
    id: 4,
    title: "Native Hardware Integration",
    category: "Mobile Engineering",
    description: "Custom FFI plugins and patched camera internals for low-latency access to device sensors and NPU/GPU delegates",
  },
  {
    id: 5,
    title: "Background Processing & Sync",
    category: "Mobile Engineering",
    description: "Isolate-based concurrent processing for uploads, inference, and data sync without blocking the UI thread",
  },
  {
    id: 6,
    title: "Offline-First Architecture",
    category: "Mobile Engineering",
    description: "Full offline capability with local database, queued sync, and conflict resolution when connectivity is restored",
  },
  {
    id: 7,
    title: "Streaming File Transfer",
    category: "Backend Systems",
    description: "Chunked streaming endpoints for large binary payloads with retry logic and progress tracking",
  },
  {
    id: 8,
    title: "Structured Observability",
    category: "Backend Systems",
    description: "Consistent logging, metrics, and tracing across services for production debugging and performance monitoring",
  },
  {
    id: 9,
    title: "Secure File Validation",
    category: "Security",
    description: "Magic byte verification, content hash deduplication, and extension allow-listing to prevent malicious uploads",
  },
  {
    id: 10,
    title: "Multi-Tenant Auth & SSO",
    category: "Security",
    description: "Switchable authentication with SSO, LDAP, and local login — built for enterprise-grade access control",
  },
  {
    id: 11,
    title: "Interactive Annotation Tools",
    category: "UI / UX",
    description: "Polygon cropping, bounding box editors, and real-time preview for training data curation and review workflows",
  },
  {
    id: 12,
    title: "Localized Multi-Language UX",
    category: "UI / UX",
    description: "Full i18n support with dynamic validation rules per locale, enabling global deployment across markets",
  },
]

export interface Feature {
  id: number
  title: string
  category: string
  description: string
  problem: string
}

export const categories = [
  "ML / AI",
  "Backend",
  "Security",
  "Data Sync",
  "User Features",
  "Core Platform",
  "Observability",
  "DevOps",
] as const

export const features: Feature[] = [
  {
    id: 22,
    title: "ONNX Model On-Device Inference (C++ Native)",
    category: "ML / AI",
    description: "On-device ML pipeline via native C++: ModelLoader with memory-aware pooling, ImageRelevancy module, NNAPI hardware acceleration, parallel inference via Dart isolates, FP16 model support",
    problem: "ML inference ran on the server causing latency and network dependency",
  },
  {
    id: 26,
    title: "Fried Potato Analysis Pipeline",
    category: "ML / AI",
    description: "End-to-end fried chips defect detection: segmentation model config, detection extraction unified across filter types, Realm schema migrations, SOP image collection guidelines",
    problem: "App only supported raw potato detection; needed fried potato quality inspection",
  },
  {
    id: 38,
    title: "Inference Retry & Polling System",
    category: "ML / AI",
    description: "API polling with status-aware updates, 30-minute inference timeout, token refresh on error, fallback model loading, analysis completion notification system",
    problem: "Server-side inference timed out silently after 30 seconds with no retry",
  },
  {
    id: 31,
    title: "Model Blob Migration & Version Management",
    category: "ML / AI",
    description: "Large binary model downloads from Azure Blob, versioned model file handling with integrity checks, remote config updates, parallel download for activity report samples",
    problem: "Models bundled in app binary caused large app size and required full update per change",
  },
  {
    id: 42,
    title: "Automatic Tuber Count",
    category: "ML / AI",
    description: "Automatic extraction and updating of tuber count from inference detection results, total detection count added to inference output",
    problem: "Tuber count had to be entered manually — error-prone and time-consuming",
  },
  {
    id: 30,
    title: "Scouting Form & Pest Detection",
    category: "User Features",
    description: "Scouting metrics repository, Excel report generation with field-level averages, pest type filtering for inference, localized validation across 4 languages",
    problem: "No scouting or pest/disease detection workflow existed",
  },
  {
    id: 23,
    title: "Bounding Box Feedback & User Input Editing",
    category: "User Features",
    description: "Multi-tab image view, tap-to-select bounding boxes, defect label editing via searchable dropdown, user-correction JSON synced to Azure, dynamic filtering by defect type",
    problem: "Field inspectors had no way to review or correct AI detections for training feedback",
  },
  {
    id: 29,
    title: "Report Validation & Submission System",
    category: "User Features",
    description: "Mandatory attribute enforcement, validation attempt tracking, reusable ValidationErrorDialog, validation status enum, dynamic submit messages",
    problem: "No mandatory field enforcement — inspectors could submit incomplete reports",
  },
  {
    id: 36,
    title: "Image Cropping with OpenCV",
    category: "User Features",
    description: "Polygon-based image cropping via native OpenCV, interactive crop point UI with real-time rendering, masked crop and binary mask output",
    problem: "Users needed precise selection of defect areas for training data annotation",
  },
  {
    id: 37,
    title: "Excel Report Generation & Metrics",
    category: "User Features",
    description: "MetricsExcelGenerator with calculated metrics, editable report card columns, UOM support, Excel export and sharing functionality",
    problem: "No exportable reports existed — results could only be viewed in-app",
  },
  {
    id: 1,
    title: "Streaming Blob Download Endpoint",
    category: "Backend",
    description: "REST endpoint serving large binary files (ONNX models ~22.5 MB) as raw streaming responses using Django StreamingHttpResponse and Azure SDK chunked iteration",
    problem: "Large file downloads failed — buffering as base64 JSON caused Gunicorn worker timeouts",
  },
  {
    id: 4,
    title: "Enhanced Structured Logging & Error Handling",
    category: "Backend",
    description: "Consistent loggable context (user email, user-agent, key-value pairs); every blob endpoint logs START / OK / ERROR with timing metrics",
    problem: "Production debugging was impossible — logs lacked user identity and timing",
  },
  {
    id: 3,
    title: "Gunicorn Production Configuration",
    category: "Backend",
    description: "Gunicorn config for Azure P0v3: gthread workers, 16-thread floor, 300s timeouts, max_requests=500 with jitter, startup hook",
    problem: "Default settings (30s timeout) caused 502 errors for 7-20 MB blob transfers",
  },
  {
    id: 6,
    title: "SHA-256 Content Hash Duplicate Detection",
    category: "Security",
    description: "SHA-256 hash computation for image bytes, checks against all existing records before accepting upload, hash stored in DB",
    problem: "Users could upload the same image multiple times, wasting bandwidth and creating duplicates",
  },
  {
    id: 9,
    title: "Malicious File Upload Prevention",
    category: "Security",
    description: "Magic byte (JPEG/PNG/HEIF/HEIC header) check, extension allow-list, cross-validation that magic bytes match extension, localized error messages",
    problem: "Any file with .jpg extension but executable payload could be uploaded to Blob Storage",
  },
]

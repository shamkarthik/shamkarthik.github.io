import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wllama } from "@wllama/wllama"

const WLLAMA_CDN = "/wllama.wasm"

const MODEL_URL = "https://huggingface.co/LiquidAI/LFM2-700M-GGUF/resolve/main/LFM2-700M-Q4_K_M.gguf"

const SYSTEM_PROMPT = `You are Sham's personal AI agent. You know everything about Sham Karthik S from the facts below.

Rules:
- Answer questions ABOUT Sham using third person ("He", "Sham", "Sham's")
- NEVER speak as if you are Sham
- Always answer questions about Sham from the facts below — never claim you don't know
- If asked something not in the facts, say "I don't have that information"
- Keep answers to 1-2 sentences unless asked for details

Facts about Sham:
- Full name: Sham Karthik S
- Senior AI/ML Engineer at Tiger Analytics (Jan 2023–Present) in Chennai, India
- Previously Software Engineer at Hexaware Technologies (total ~4 years)
- Builds production AI systems for mobile/edge devices — on-device computer vision, fraud detection, cross-platform engineering

Work Projects at Tiger Analytics:
- AIGronomist: On-device potato disease detection using CV models on mobile
- PepIris: On-device fraud detection CV for financial transaction monitoring
- Mobile R&D — GenAI: Generative AI research/prototyping for mobile platforms
- Innovation Incrementality V2: Incrementality measurement & impact analysis
- App Templates: Cross-platform mobile app templates & architecture patterns

Work Projects at Hexaware Technologies:
- RapidX: Rapid application development framework
- Automaton: Process automation & workflow optimization

Personal Projects:
- TLDR-ON: Chrome extension for AI-powered text summarization (on Chrome Web Store)
- PayFinder: Payment discovery & management tool

Skills:
- Languages: TypeScript/JavaScript, Python, C++, Dart, Kotlin, SQL
- Frontend: React, Tailwind CSS, Framer Motion, HTML5/CSS3
- Mobile: React Native, Flutter, Kotlin Multiplatform, Android
- AI/ML: ONNX Runtime, TensorFlow Lite, Core ML, Computer Vision, Edge Inference, GenAI
- Backend/Cloud: Node.js, Azure, Docker, CI/CD (GitHub Actions), REST APIs
- Tools: Git, VS Code, Postman, Figma, Firebase, Webpack/Vite

Languages: English (fluent), Tamil (native)
Location: Chennai, India

Links:
- Email: shamkarthik88@gmail.com
- GitHub: https://github.com/shamkarthik
- LinkedIn: https://linkedin.com/in/sham-karthik-s
- Medium: https://medium.com/@shamkarthik88
- Resume: https://shamkarthik.github.io/ShamkarthikS.pdf`

interface Message {
  role: "user" | "assistant"
  content: string
}

type PopupState =
  | { phase: "closed" }
  | { phase: "loading" }
  | { phase: "error"; message: string }
  | { phase: "ready" }
  | { phase: "generating" }

export default function ChatPopup() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<PopupState>({ phase: "closed" })
  const [progress, setProgress] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const wllamaRef = useRef<Wllama | null>(null)
  const configRef = useRef({ max_tokens: 4096 })
  const abortRef = useRef<AbortController | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || state.phase !== "closed") return

    setState({ phase: "loading" })
    let cancelled = false

    ;(async () => {
      try {
        const wllama = new Wllama({ default: WLLAMA_CDN })

        const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent)
        const cores = navigator.hardwareConcurrency || 4
        const mem = (navigator as any).deviceMemory || (isMobile ? 4 : 8)
        const highEnd = mem >= 8 && cores >= 6 && !isMobile

        const n_ctx = highEnd ? 8192 : 4096
        const max_tokens = highEnd ? 4096 : 2048
        const n_threads = highEnd ? Math.min(cores, 8) : Math.min(cores, 4)
        configRef.current = { max_tokens }

        await wllama.loadModelFromUrl(MODEL_URL, {
          n_batch: Math.min(n_ctx, 1024),
          n_ctx,
          n_threads,
          progressCallback: (p) => {
            if (!cancelled) {
              const pct = Math.round((p.loaded / p.total) * 100)
              setProgress(`Downloading model... ${pct}%`)
            }
          },
        })
        if (cancelled) return
        wllamaRef.current = wllama
        if (!cancelled) {
          setState({ phase: "ready" })
          setMessages([
            {
              role: "assistant",
              content: "Hey! I'm an AI agent who knows about Sham Karthik S. Ask me anything about his experience, skills, or projects!",
            },
          ])
        }
      } catch (err: unknown) {
        if (cancelled) return
        const msg = err instanceof Error ? err.message : String(err)
        setState({ phase: "error", message: msg })
      }
    })()

    return () => { cancelled = true }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open, state.phase])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || state.phase !== "ready") return

    setInput("")
    const userMsg: Message = { role: "user", content: text }
    setMessages((prev) => [...prev, userMsg])

    const abortController = new AbortController()
    abortRef.current = abortController
    setState({ phase: "generating" })

    const assistantMsg: Message = { role: "assistant", content: "" }
    setMessages((prev) => [...prev, assistantMsg])

    try {
      const history = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
        userMsg,
      ]

      const stream = await wllamaRef.current!.createChatCompletion({
        messages: history as any,
        max_tokens: configRef.current.max_tokens,
        temperature: 0.3,
        cache_prompt: true,
        stream: true,
        abortSignal: abortController.signal,
      })

      let full = ""
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || ""
        full += delta
        setMessages((prev) => {
          const next = [...prev]
          next[next.length - 1] = { role: "assistant", content: full }
          return next
        })
      }
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") return
      const msg = err instanceof Error ? err.message : String(err)
      setMessages((prev) => {
        const next = [...prev]
        next[next.length - 1] = { role: "assistant", content: `Error: ${msg}` }
        return next
      })
    } finally {
      abortRef.current = null
      setState((prev) => (prev.phase === "generating" ? { phase: "ready" } : prev))
    }
  }

  function handleStop() {
    abortRef.current?.abort()
    abortRef.current = null
    setState({ phase: "ready" })
  }

  function handleReset() {
    setMessages([
      {
        role: "assistant",
        content: "Hey! I'm an AI agent who knows about Sham Karthik S. Ask me anything about his experience, skills, or projects!",
      },
    ])
  }

  function handleToggle() {
    setOpen((prev) => !prev)
  }

  return (
    <>
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-neon-blue text-black shadow-lg transition-all duration-200 hover:bg-neon-blue/90 hover:scale-110 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]"
        aria-label="Toggle AI Chat"
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex w-[360px] flex-col rounded-2xl border border-card bg-primary shadow-2xl backdrop-blur-xl sm:w-[400px]"
            style={{ maxHeight: "min(600px, calc(100vh - 140px))" }}
          >
            <div className="flex items-center justify-between rounded-t-2xl border-b border-card px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neon-blue/20">
                  <svg className="h-4 w-4 text-neon-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Sham's AI Agent</p>
                  <p className="text-[10px] text-muted">
                    {state.phase === "loading" ? "Loading…" : state.phase === "error" ? "Offline" : "On-device · Ready"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {(state.phase === "ready" || state.phase === "generating") && (
                  <button
                    onClick={handleReset}
                    className="rounded-lg px-2.5 py-1 text-xs text-muted transition-colors hover:bg-hover hover:text-primary"
                    title="Reset chat"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
              {state.phase === "loading" && (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-3 h-7 w-7 animate-spin rounded-full border-2 border-neon-blue border-t-transparent" />
                  <p className="text-xs text-muted">Loading model…</p>
                  {progress && <p className="mt-1 text-[10px] text-muted">{progress}</p>}
                </div>
              )}

              {state.phase === "error" && (
                <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                  <svg className="mb-3 h-8 w-8 text-neon-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <p className="mb-1 text-xs font-semibold text-neon-pink">Failed to Load</p>
                  <p className="text-[10px] text-muted">{state.phase === "error" ? state.message : ""}</p>
                </div>
              )}

              {(state.phase === "ready" || state.phase === "generating") && (
                <div className="space-y-3">
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                          m.role === "user"
                            ? "bg-neon-blue/20 text-primary"
                            : "bg-hover text-secondary"
                        }`}
                      >
                        {m.content}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            {(state.phase === "ready" || state.phase === "generating") && (
              <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-card p-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Sham…"
                  disabled={state.phase === "generating"}
                  className="flex-1 rounded-lg border border-card bg-hover px-3.5 py-2 text-sm text-primary placeholder-muted outline-none transition-all focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 disabled:opacity-50"
                />
                {state.phase === "generating" ? (
                  <button
                    type="button"
                    onClick={handleStop}
                    className="rounded-lg bg-neon-pink/20 px-3 py-2 text-sm font-medium text-neon-pink transition-colors hover:bg-neon-pink/30"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="rounded-lg bg-neon-blue px-3 py-2 text-sm font-medium text-black transition-all duration-200 hover:bg-neon-blue/90 disabled:opacity-40"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
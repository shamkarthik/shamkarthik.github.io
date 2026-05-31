import { useState, useRef, useEffect, useCallback } from "react"
import { Wllama, ModelManager } from "@wllama/wllama"
import { MarkdownMessage } from "./MarkdownMessage"

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
  | { phase: "downloading"; progress: string }
  | { phase: "loading" }
  | { phase: "error"; message: string }
  | { phase: "ready" }
  | { phase: "generating" }

const modelManager = new ModelManager()

function createWllamaInstance() {
  const instance = new Wllama({ default: "/wllama.wasm" })
  return instance
}

let wllamaInstance = createWllamaInstance()

export default function ChatPopup() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<PopupState>({ phase: "closed" })
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesRef = useRef<Message[]>([])
  const abortRef = useRef<AbortController | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    if (!open || state.phase !== "closed") return

    let cancelled = false

    const load = async () => {
      try {
        if (!cancelled) {
          setState({ phase: "downloading", progress: "Checking cache…" })
        }

        const source = { url: MODEL_URL }
        const model = await modelManager.getModelOrDownload(source, {
          progressCallback: (p) => {
            if (!cancelled) {
              const pct = Math.round((p.loaded / p.total) * 100)
              setState({ phase: "downloading", progress: `Loading ${pct}%` })
            }
          },
        })

        if (cancelled) return

        setState({ phase: "loading" })

        const nCtx = 4096
        await wllamaInstance.loadModel(model, {
          n_ctx: nCtx,
          n_batch: 128,
        })

        if (!cancelled) {
          const initMsg: Message[] = [
            {
              role: "assistant",
              content: "Hey! I'm an AI agent who knows about Sham Karthik S. Ask me anything about his experience, skills, or projects!",
            },
          ]
          messagesRef.current = initMsg
          setMessages(initMsg)
          setState({ phase: "ready" })
        }
      } catch (err: unknown) {
        if (cancelled) return
        const msg = err instanceof Error ? err.message : String(err)
        setState({ phase: "error", message: msg })
      }
    }

    load()

    return () => { cancelled = true }
  }, [open])

  useEffect(() => {
    if (state.phase === "generating") {
      const interval = setInterval(scrollToBottom, 100)
      return () => clearInterval(interval)
    }
    scrollToBottom()
  }, [messages, state.phase, scrollToBottom])

  useEffect(() => {
    if (open && state.phase === "ready") inputRef.current?.focus()
  }, [open, state.phase])

  const handleSend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || state.phase !== "ready") return

    setInput("")
    const userMsg: Message = { role: "user", content: text }

    const newMessages = [...messagesRef.current, userMsg]
    messagesRef.current = newMessages
    setMessages(newMessages)

    const assistantMsg: Message = { role: "assistant", content: "" }
    const withAssistant = [...newMessages, assistantMsg]
    messagesRef.current = withAssistant
    setMessages(withAssistant)

    const abortController = new AbortController()
    abortRef.current = abortController
    setState({ phase: "generating" })

    try {
      const history = [
        { role: "system" as const, content: SYSTEM_PROMPT },
        ...messagesRef.current.slice(0, -1),
        userMsg,
      ]

      const stream = await wllamaInstance.createChatCompletion({
        messages: history,
        max_tokens: 4096,
        temperature: 0.2,
        cache_prompt: true,
        stream: true,
        abortSignal: abortController.signal,
      })

      let accumulatedText = ""
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content
        if (delta) {
          accumulatedText += delta
          const updated = [...messagesRef.current]
          updated[updated.length - 1] = { role: "assistant", content: accumulatedText }
          messagesRef.current = updated
          setMessages(updated)
        }
      }
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") return
      const msg = err instanceof Error ? err.message : String(err)
      const updated = [...messagesRef.current]
      updated[updated.length - 1] = { role: "assistant", content: `Error: ${msg}` }
      messagesRef.current = updated
      setMessages(updated)
    } finally {
      abortRef.current = null
      setState((prev) => (prev.phase === "generating" ? { phase: "ready" } : prev))
    }
  }, [input, state.phase])

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setState({ phase: "ready" })
  }, [])

  const handleReset = useCallback(() => {
    const initMsg: Message[] = [
      {
        role: "assistant",
        content: "Hey! I'm an AI agent who knows about Sham Karthik S. Ask me anything about his experience, skills, or projects!",
      },
    ]
    messagesRef.current = initMsg
    setMessages(initMsg)
  }, [])

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

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

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-[360px] flex-col rounded-2xl border border-card bg-card shadow-lg sm:w-[400px]"
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
                  {state.phase === "downloading" ? state.progress :
                   state.phase === "loading" ? "Initializing…" :
                   state.phase === "error" ? "Offline" : "On-device · Ready"}
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

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
            {(state.phase === "downloading" || state.phase === "loading") && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-3 h-7 w-7 animate-spin rounded-full border-2 border-neon-blue border-t-transparent" />
                <p className="text-xs text-muted">
                  {state.phase === "downloading" ? "Downloading model…" : "Initializing model…"}
                </p>
                {state.phase === "downloading" && state.progress && (
                  <p className="mt-1 text-[10px] text-muted">{state.progress}</p>
                )}
              </div>
            )}

            {state.phase === "error" && (
              <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                <svg className="mb-3 h-8 w-8 text-neon-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="mb-1 text-xs font-semibold text-neon-pink">Failed to Load</p>
                <p className="text-[10px] text-muted">{state.message}</p>
              </div>
            )}

            {(state.phase === "ready" || state.phase === "generating") && (
              <div className="space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-neon-blue/20 text-primary"
                          : "bg-hover text-secondary"
                      }`}
                    >
                      {m.content.length === 0 && state.phase === "generating" && (
                        <span className="inline-block h-4 w-2 animate-pulse rounded bg-neon-blue/50" />
                      )}
                      {m.content.length > 0 && <MarkdownMessage content={m.content} />}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {(state.phase === "ready" || state.phase === "generating") && (
            <form onSubmit={handleSend} className="flex items-end gap-2 border-t border-card p-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Sham…"
                disabled={state.phase === "generating"}
                className="flex-1 resize-none rounded-lg border border-card bg-hover px-3.5 py-2 text-sm text-primary placeholder-muted outline-none transition-all focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 disabled:opacity-50"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend(e)
                  }
                }}
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
        </div>
      )}
    </>
  )
}

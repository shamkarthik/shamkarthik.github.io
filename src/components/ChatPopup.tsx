import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreateMLCEngine, type ChatCompletionMessageParam } from "@mlc-ai/web-llm"

const MODEL_ID = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC"

const SYSTEM_PROMPT = `You are Sham's personal AI agent. You know everything about Sham Karthik S from the facts below.

Rules:
- Answer questions ABOUT Sham using third person ("He", "Sham", "Sham's")
- NEVER speak as if you are Sham
- Always answer questions about Sham from the facts below — never claim you don't know
- If asked something not in the facts, say "I don't have that information"
- Keep answers to 1-2 sentences

Facts about Sham:
- Full name: Sham Karthik S
- Senior AI/ML Engineer at Tiger Analytics (Jan 2023–Present)
- Previously Software Engineer at Hexaware Technologies
- Skilled in TypeScript, Python, C++, React, Flutter, React Native, ONNX, Azure, Docker
- Built AIGronomist (on-device potato disease CV), PepIris (fraud detection), TLDR-ON (Chrome extension), PayFinder
- Speaks English and Tamil
- Email: shamkarthik88@gmail.com | GitHub: github.com/shamkarthik | LinkedIn: linkedin.com/in/sham-karthik-s`

interface Message {
  role: "user" | "assistant"
  content: string
}

type PopupState =
  | { phase: "closed" }
  | { phase: "loading" }
  | { phase: "error"; message: string }
  | { phase: "ready" }
  | { phase: "generating"; abortController: AbortController }

export default function ChatPopup() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<PopupState>({ phase: "closed" })
  const [progress, setProgress] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const engineRef = useRef<Awaited<ReturnType<typeof CreateMLCEngine>> | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || state.phase !== "closed") return

    setState({ phase: "loading" })
    let cancelled = false

    ;(async () => {
      try {
        const engine = await CreateMLCEngine(MODEL_ID, {
          initProgressCallback: (p) => {
            if (!cancelled) setProgress(p.text || `${Math.round((p.progress || 0) * 100)}%`)
          },
        })
        if (cancelled) return
        engineRef.current = engine
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
    setState({ phase: "generating", abortController })

    const assistantMsg: Message = { role: "assistant", content: "" }
    setMessages((prev) => [...prev, assistantMsg])

    try {
      const history: ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
        userMsg,
      ]

      const chunks = await engineRef.current!.chat.completions.create({
        messages: history,
        temperature: 0.3,
        max_tokens: 256,
        stream: true,
      })

      let full = ""
      for await (const chunk of chunks) {
        const delta = chunk.choices[0]?.delta.content || ""
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
      setState((prev) => (prev.phase === "generating" ? { phase: "ready" } : prev))
    }
  }

  function handleStop() {
    if (state.phase === "generating") {
      state.abortController.abort()
      setState({ phase: "ready" })
    }
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
                  <p className="mb-1 text-xs font-semibold text-neon-pink">WebGPU Required</p>
                  <p className="text-[10px] text-muted">This browser doesn't support WebGPU. Try Chrome on a device with a capable GPU.</p>
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

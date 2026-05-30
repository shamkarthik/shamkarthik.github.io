import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreateMLCEngine } from "@mlc-ai/web-llm"

const MODEL_ID = "SmolLM2-360M-Instruct-q4f16_1-MLC"

interface Message {
  role: "user" | "assistant"
  content: string
}

type PageState =
  | { phase: "loading" }
  | { phase: "error"; message: string }
  | { phase: "ready" }
  | { phase: "generating"; abortController: AbortController }

export default function Chat() {
  const [state, setState] = useState<PageState>({ phase: "loading" })
  const [progress, setProgress] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm running locally in your browser via WebLLM. Ask me anything!" },
  ])
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const engineRef = useRef<Awaited<ReturnType<typeof CreateMLCEngine>> | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
        setState({ phase: "ready" })
      } catch (err: unknown) {
        if (cancelled) return
        const msg = err instanceof Error ? err.message : String(err)
        setState({ phase: "error", message: msg })
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || state.phase === "generating") return

    setInput("")
    const userMsg: Message = { role: "user", content: text }
    setMessages((prev) => [...prev, userMsg])

    const abortController = new AbortController()
    setState({ phase: "generating", abortController })

    const assistantMsg: Message = { role: "assistant", content: "" }
    setMessages((prev) => [...prev, assistantMsg])

    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }))
      const chunks = await engineRef.current!.chat.completions.create({
        messages: history,
        temperature: 0.7,
        max_tokens: 1024,
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
      const msg = err instanceof Error ? err.message : String(err)
      setMessages((prev) => {
        const next = [...prev]
        next[next.length - 1] = { role: "assistant", content: `Error: ${msg}` }
        return next
      })
    } finally {
      setState((prev) => (prev.phase === "generating" ? { phase: "ready" } : prev))
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  function handleStop() {
    if (state.phase === "generating") {
      state.abortController.abort()
    }
  }

  function handleReset() {
    setMessages([
      { role: "assistant", content: "Hi! I'm running locally in your browser via WebLLM. Ask me anything!" },
    ])
  }

  return (
    <div className="pt-24">
      <section className="py-12">
        <div className="mx-auto max-w-2xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-6xl">
              AI <span className="text-gradient">Chat</span>
            </h1>
            <p className="mb-8 text-lg text-secondary">On-device LLM powered by WebLLM — runs entirely in your browser.</p>
          </motion.div>

          {state.phase === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-xl border border-card bg-card p-12 text-center"
            >
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-neon-blue border-t-transparent" />
              <p className="text-sm text-muted">Loading model…</p>
              {progress && <p className="mt-2 text-xs text-muted">{progress}</p>}
            </motion.div>
          )}

          {state.phase === "error" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-neon-pink/30 bg-neon-pink/5 p-6 text-center"
            >
              <p className="mb-2 font-semibold text-neon-pink">Failed to load model</p>
              <p className="text-sm text-secondary">{state.message}</p>
              <p className="mt-4 text-xs text-muted">WebLLM requires WebGPU. Try Chrome or Edge on a device with a capable GPU.</p>
            </motion.div>
          )}

          {(state.phase === "ready" || state.phase === "generating") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex h-[65vh] min-h-[350px] flex-col rounded-xl border border-card bg-card"
            >
              <div className="flex items-center justify-between border-b border-card px-4 py-3">
                <span className="text-xs font-medium text-secondary">Llama-3.2-1B · <span className="text-neon-green">Active</span></span>
                <button onClick={handleReset} className="rounded-lg px-3 py-1 text-xs text-muted transition-colors hover:bg-hover hover:text-primary">
                  Reset
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                          m.role === "user"
                            ? "bg-neon-blue/20 text-primary"
                            : "bg-hover text-secondary"
                        }`}
                      >
                        {m.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-card p-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message…"
                  disabled={state.phase === "generating"}
                  className="flex-1 rounded-lg border border-card bg-hover px-4 py-2.5 text-sm text-primary placeholder-muted outline-none transition-all focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 disabled:opacity-50"
                />
                {state.phase === "generating" ? (
                  <button
                    type="button"
                    onClick={handleStop}
                    className="rounded-lg bg-neon-pink/20 px-4 py-2.5 text-sm font-medium text-neon-pink transition-colors hover:bg-neon-pink/30"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="rounded-lg bg-neon-blue px-4 py-2.5 text-sm font-medium text-black transition-all duration-200 hover:bg-neon-blue/90 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] disabled:opacity-40"
                  >
                    Send
                  </button>
                )}
              </form>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

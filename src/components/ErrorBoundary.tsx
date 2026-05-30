import { Component, type ReactNode } from "react"

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() { return { hasError: true } }

  handleRetry = () => this.setState({ hasError: false })

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-neon-pink/20 text-neon-pink shadow-lg">
          <button onClick={this.handleRetry} className="flex h-full w-full items-center justify-center" title="Chat error — click to retry">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

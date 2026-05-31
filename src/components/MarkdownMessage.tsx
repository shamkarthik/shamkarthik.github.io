import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

interface MarkdownMessageProps {
  content: string
}

const markdownComponents: Components = {
  code({ inline, children, ...props }: any) {
    if (inline) {
      return (
        <code className="rounded bg-hover px-1 py-0.5 text-xs text-neon-blue" {...props}>
          {children}
        </code>
      )
    }

    return (
      <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-hover p-2 text-xs">
        <code className="text-neon-blue" {...props}>
          {children}
        </code>
      </pre>
    )
  },
  a({ href, children, ...props }) {
    return (
      <a
        href={href}
        className="text-neon-blue underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  },
  p({ children, ...props }) {
    return <p className="mb-2 last:mb-0" {...props}>{children}</p>
  },
  ul({ children, ...props }) {
    return <ul className="mb-2 list-disc pl-4 last:mb-0" {...props}>{children}</ul>
  },
  ol({ children, ...props }) {
    return <ol className="mb-2 list-decimal pl-4 last:mb-0" {...props}>{children}</ol>
  },
  li({ children, ...props }) {
    return <li className="mb-1" {...props}>{children}</li>
  },
}

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={markdownComponents}
      skipHtml
    >
      {content}
    </ReactMarkdown>
  )
}
export default function Footer() {
  return (
    <footer className="border-t border-card py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Sham Karthik S. Built with React 19 + Vite
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/shamkarthik" target="_blank" rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-neon-blue">
              GitHub
            </a>
            <a href="https://linkedin.com/in/sham-karthik-s" target="_blank" rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-neon-blue">
              LinkedIn
            </a>
            <a href="https://medium.com/@shamkarthik88" target="_blank" rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-neon-blue">
              Medium
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}





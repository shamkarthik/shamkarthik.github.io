import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HashRouter } from "react-router-dom"
import { ThemeProvider } from "./data/ThemeContext"
import App from "./App"
import "./index.css"

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <ThemeProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
)






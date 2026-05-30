import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ParticleBackground from "./components/ParticleBackground"
import Home from "./pages/Home"
import Blog from "./pages/Blog"
import Chat from "./pages/Chat"
import Contact from "./pages/Contact"
import Contributions from "./pages/Contributions"

export default function App() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contributions" element={<Contributions />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}






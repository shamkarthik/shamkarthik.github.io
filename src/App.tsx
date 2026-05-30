import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"
import ChatPopup from "./components/ChatPopup"
import ElectricEffect from "./components/ElectricEffect"
import Home from "./pages/Home"
import Blog from "./pages/Blog"
import Contact from "./pages/Contact"
import Contributions from "./pages/Contributions"

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ElectricEffect />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contributions" element={<Contributions />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ScrollToTop />
      <Footer />
      <ChatPopup />
    </div>
  )
}






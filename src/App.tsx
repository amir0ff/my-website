import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Portfolio from "./components/Portfolio";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import BackToTop from "./components/BackToTop";
import DeferredSection from "./components/DeferredSection";

export default function App() {
  return (
    <main className="min-h-screen bg-[#141414]">
      <Navbar />
      <Hero />
      <About />
      <Portfolio />
      <Blog />
      <DeferredSection id="contact" minHeight={640}>
        <Contact />
      </DeferredSection>

      <BackToTop />

      <footer className="bg-[#EDEDED] py-8 text-center text-[#666666] text-xs">
        <p>&copy; {new Date().getFullYear()} Amir Off. All rights reserved.</p>
      </footer>
    </main>
  );
}

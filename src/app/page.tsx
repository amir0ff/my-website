import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#141414]">
      <Navbar />
      <Hero />
      <About />
      <Portfolio />
      <Blog />
      <Contact />
      
      <BackToTop />

      {/* Legacy Footer style */}
      <footer className="bg-[#EDEDED] py-8 text-center text-[#959595] text-xs">
         <p>&copy; {new Date().getFullYear()} Amir Off. All rights reserved.</p>
      </footer>
    </main>
  );
}

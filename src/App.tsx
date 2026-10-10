import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import BackToTop from "./components/BackToTop";
import DeferredSection from "./components/DeferredSection";

const Portfolio = lazy(() => import("./components/Portfolio"));
const Blog = lazy(() => import("./components/Blog"));
const Contact = lazy(() => import("./components/Contact"));

function SectionFallback({ minHeight }: { minHeight: number }) {
  return <div style={{ minHeight }} aria-hidden="true" />;
}

export default function App() {
  return (
    <main className="min-h-screen bg-[#141414]">
      <Navbar />
      <Hero />
      <About />

      <DeferredSection id="portfolio" minHeight={720}>
        <Suspense fallback={<SectionFallback minHeight={720} />}>
          <Portfolio />
        </Suspense>
      </DeferredSection>

      <DeferredSection id="blog" minHeight={640}>
        <Suspense fallback={<SectionFallback minHeight={640} />}>
          <Blog />
        </Suspense>
      </DeferredSection>

      <DeferredSection id="contact" minHeight={640}>
        <Suspense fallback={<SectionFallback minHeight={640} />}>
          <Contact />
        </Suspense>
      </DeferredSection>

      <BackToTop />

      <footer className="bg-[#EDEDED] py-8 text-center text-[#666666] text-xs">
        <p>&copy; {new Date().getFullYear()} Amir Off. All rights reserved.</p>
      </footer>
    </main>
  );
}

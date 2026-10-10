import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { scrollToTarget } from "@/lib/lenis";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <button
      type="button"
      onClick={() => scrollToTarget(0)}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-5 right-5 z-40 bg-black/50 text-white w-10 h-10 flex items-center justify-center rounded hover:bg-black transition-all cursor-pointer",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none",
      )}
    >
      <i className="fas fa-chevron-up" aria-hidden="true" />
    </button>
  );
}

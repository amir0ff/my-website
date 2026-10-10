import { useEffect, useRef, useState, type ReactNode } from "react";
import { scrollToTarget } from "@/lib/lenis";

/**
 * Mount children only once the placeholder nears the viewport (or the
 * section hash is requested). Keeps a stable `id` so in-page links work
 * before the heavy content mounts.
 */
export default function DeferredSection({
  id,
  children,
  rootMargin = "300px",
  minHeight = 420,
  className,
  scrollOffset = -70,
}: {
  id?: string;
  children: ReactNode;
  rootMargin?: string;
  minHeight?: number;
  className?: string;
  scrollOffset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => {
    if (typeof IntersectionObserver === "undefined") return true;
    if (id && typeof location !== "undefined" && location.hash === `#${id}`) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (!id) return;

    const activateFromHash = () => {
      if (location.hash === `#${id}`) setVisible(true);
    };

    window.addEventListener("hashchange", activateFromHash);
    return () => window.removeEventListener("hashchange", activateFromHash);
  }, [id]);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  useEffect(() => {
    if (!visible || !id) return;
    if (location.hash !== `#${id}`) return;

    const timer = window.setTimeout(() => {
      scrollToTarget(`#${id}`, { offset: scrollOffset });
    }, 50);

    return () => window.clearTimeout(timer);
  }, [visible, id, scrollOffset]);

  return (
    <div
      id={id}
      ref={ref}
      className={className}
      style={visible ? undefined : { minHeight }}
    >
      {visible ? children : null}
    </div>
  );
}

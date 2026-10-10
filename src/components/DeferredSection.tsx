import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Mount children only once the placeholder nears the viewport.
 * Keeps heavy below-fold sections (reCAPTCHA, etc.) off the critical path.
 */
export default function DeferredSection({
  children,
  rootMargin = "300px",
  minHeight = 420,
  className,
}: {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

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

  return (
    <div
      ref={ref}
      className={className}
      style={visible ? undefined : { minHeight }}
    >
      {visible ? children : null}
    </div>
  );
}

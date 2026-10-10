import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenis = instance;
}

/** Scroll via Lenis when available; fall back to native smooth scroll. */
export function scrollToTarget(
  target: string | number,
  options: { offset?: number } = {},
) {
  const offset = options.offset ?? 0;

  if (lenis) {
    lenis.scrollTo(target, { offset });
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior: "smooth" });
    return;
  }

  const id = target.startsWith("#") ? target.slice(1) : target;
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}

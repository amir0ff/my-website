import { useEffect, useRef } from "react";

declare global {
  interface Window {
    GitHubGraph?: {
      render: (options: {
        username: string;
        target: string | HTMLElement;
        theme?: "light" | "dark" | "auto";
        showLegend?: boolean;
        showTotal?: boolean;
      }) => void;
    };
  }
}

let scriptLoadPromise: Promise<void> | null = null;

function loadGitHubGraphScript(): Promise<void> {
  if (window.GitHubGraph) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/gh-graph.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load gh-graph.js"));
    document.body.appendChild(script);
  });

  return scriptLoadPromise;
}

interface GitHubContributionGraphProps {
  username: string;
  showLegend?: boolean;
  showTotal?: boolean;
}

export default function GitHubContributionGraph({
  username,
  showLegend,
  showTotal,
}: GitHubContributionGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    loadGitHubGraphScript()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        window.GitHubGraph?.render({
          username,
          target: containerRef.current,
          theme: "dark",
          showLegend,
          showTotal,
        });
      })
      .catch((err) => {
        console.error("GitHub contribution graph:", err);
      });

    return () => {
      cancelled = true;
      container.innerHTML = "";
    };
  }, [username, showLegend, showTotal]);

  return <div ref={containerRef} className="ghgraph ghgraph--dark" />;
}

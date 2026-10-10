import { useEffect, useState } from "react";
import GitHubContributionGraph from "./GitHubContributionGraph";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string | null;
  fork: boolean;
  is_template?: boolean;
  clone_url: string;
  created_at: string;
  owner: {
    login: string;
  };
}

const PERSONAL_OWNER = "amir0ff";
const EXCLUDED_CLONE_URLS = new Set([
  "https://github.com/amir0ff/amir0ff.git",
]);

/** Personal account + orgs whose public repos should appear in the grid. */
const REPO_SOURCES = [
  `https://api.github.com/users/${PERSONAL_OWNER}/repos?per_page=100`,
  "https://api.github.com/orgs/DedSecLabs/repos?per_page=100",
];

const LANGUAGE_COLORS: Record<string, string> = {
  javascript: "#f1e05a",
  typescript: "#3178c6",
  python: "#3572A5",
  html: "#e34c26",
  css: "#563d7c",
  php: "#4f5d95",
  java: "#b07219",
  "c++": "#f34b7d",
  "c#": "#178600",
  go: "#00add8",
  rust: "#dea584",
  ruby: "#701516",
  swift: "#ffac45",
  shell: "#89e051",
  vue: "#41b883",
  react: "#61dafb",
  lua: "#000080",
};

async function fetchRepoSource(url: string): Promise<Repo[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} for ${url}`);
  }
  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error(`Unexpected GitHub API payload for ${url}`);
  }
  return data as Repo[];
}

export default function Portfolio() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const results = await Promise.allSettled(
          REPO_SOURCES.map((url) => fetchRepoSource(url)),
        );

        const merged = new Map<number, Repo>();
        for (const result of results) {
          if (result.status !== "fulfilled") {
            console.error("Error fetching repos:", result.reason);
            continue;
          }
          for (const repo of result.value) {
            merged.set(repo.id, repo);
          }
        }

        if (merged.size === 0) {
          setError(true);
          return;
        }

        const filtered = [...merged.values()]
          .filter(
            (repo) =>
              !repo.fork && !EXCLUDED_CLONE_URLS.has(repo.clone_url),
          )
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );
        setRepos(filtered);
      } catch (error) {
        console.error("Error fetching repos:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  return (
    <article id="portfolio" className="bg-[#202020] section-padding relative">
      <div className="container mx-auto px-4">
        <div className="text-center mt-24">
          <img
            src="/images/hero-circuit-bg.svg"
            alt=""
            width={800}
            height={200}
            className="mx-auto mb-8 opacity-80"
          />
          <h2 className="text-3xl mb-12">My GitHub</h2>

          <div className="flex justify-center mb-16 px-4">
            <div className="bg-[#0d0d0d] p-4 rounded-md shadow-[0_3px_13px_0_rgba(0,0,0,0.6)] w-full max-w-[800px] overflow-hidden">
              <GitHubContributionGraph username="amir0ff" showLegend={false} />
            </div>
          </div>

          {error && repos.length === 0 && (
            <div className="bg-[#fcf8e3] border-[#faebcc] text-[#8a6d3b] p-4 rounded-md mx-auto max-w-[500px] text-center mb-8">
              Cannot fetch repositories! You can view them on{" "}
              <a
                href="https://github.com/amir0ff"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline"
              >
                GitHub
              </a>
              .
            </div>
          )}

          <div className="flex flex-wrap -mx-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
                    <div className="bg-[#0d0d0d] p-6 rounded-md shadow-[0_3px_13px_0_rgba(0,0,0,0.6)] h-[120px] animate-pulse">
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-4 bg-[#2a2a2a] rounded w-1/3" />
                        <div className="h-3 bg-[#2a2a2a] rounded w-16" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-[#2a2a2a] rounded w-full" />
                        <div className="h-3 bg-[#2a2a2a] rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))
              : repos.map((repo) => {
                  const isOrgRepo = repo.owner.login !== PERSONAL_OWNER;
                  return (
                    <div
                      key={repo.id}
                      className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8"
                    >
                      <div className="bg-[#0d0d0d] p-6 rounded-md shadow-[0_3px_13px_0_rgba(0,0,0,0.6)] repo-card-hover h-full text-left relative overflow-hidden group">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <div className="flex justify-between items-start mb-4 gap-3">
                            <div className="min-w-0">
                              {isOrgRepo && (
                                <p className="text-[10px] text-[#959595] uppercase tracking-[1px] mb-1 truncate">
                                  {repo.owner.login}
                                </p>
                              )}
                              <h5 className="text-white font-medium normal-case tracking-normal truncate">
                                {repo.name}
                              </h5>
                            </div>
                            {(repo.language || repo.is_template) && (
                              <span className="text-[10px] text-[#959595] uppercase flex items-center shrink-0">
                                <span
                                  className="w-2 h-2 rounded-full mr-1"
                                  style={{
                                    backgroundColor:
                                      LANGUAGE_COLORS[
                                        (repo.language || "other").toLowerCase()
                                      ] || "#8b8b8b",
                                  }}
                                />
                                {repo.language ||
                                  (repo.is_template ? "Template" : "Archive")}
                              </span>
                            )}
                          </div>
                          <p className="text-[#959595] text-sm line-clamp-3">
                            {repo.description}
                          </p>
                        </a>
                      </div>
                    </div>
                  );
                })}
          </div>

          <div className="text-right mt-8 flex justify-end">
            <p className="text-[#959595] text-sm font-roboto">
              Powered by{" "}
              <a
                href="https://github.com/amir0ff"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-white"
              >
                GitHub
              </a>
              {" · "}
              <a
                href="https://github.com/DedSecLabs"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-white"
              >
                DedSecLabs
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="triangle-decorator text-[#202020]" />
    </article>
  );
}

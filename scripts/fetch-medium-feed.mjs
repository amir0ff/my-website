/**
 * Fetch Medium's official RSS feed at build/dev time and write a static
 * JSON snapshot for the Blog section. Avoids brittle client-side RSS→JSON
 * proxies (Medium has no supported public read API).
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, "../src/data/medium-posts.json");
const FEED_URL = "https://medium.com/feed/@amir0ff";
const MAX_POSTS = 14;

function cdata(block, tag) {
  const re = new RegExp(
    `<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}>([\\s\\S]*?)</${tag}>`,
    "i",
  );
  const match = block.match(re);
  return (match?.[1] ?? match?.[2] ?? "").trim();
}

function extractImage(html) {
  const match = html.match(/<img[^>]+src="([^">]+)"/i);
  return match?.[1] ?? "";
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseFeed(xml) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(
    (match) => match[1],
  );

  return items
    .map((item) => {
      const title = cdata(item, "title");
      const link = cdata(item, "link");
      const pubDate = cdata(item, "pubDate");
      const content =
        cdata(item, "content:encoded") || cdata(item, "description");
      const categories = [
        ...item.matchAll(
          /<category><!\[CDATA\[(.*?)\]\]><\/category>|<category>(.*?)<\/category>/gi,
        ),
      ]
        .map((m) => (m[1] ?? m[2] ?? "").trim())
        .filter(Boolean);

      const description = stripHtml(content).slice(0, 280);

      return {
        title,
        link,
        pubDate,
        description,
        thumbnail: extractImage(content),
        categories,
      };
    })
    .filter((post) => post.title && post.link && post.categories.length > 0)
    .sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
    )
    .slice(0, MAX_POSTS);
}

function readExisting() {
  if (!existsSync(OUT_PATH)) return null;
  try {
    return JSON.parse(readFileSync(OUT_PATH, "utf8"));
  } catch {
    return null;
  }
}

async function main() {
  mkdirSync(dirname(OUT_PATH), { recursive: true });

  try {
    const response = await fetch(FEED_URL, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*",
        "User-Agent": "amiroff.org-portfolio-build/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Medium RSS HTTP ${response.status}`);
    }

    const xml = await response.text();
    const posts = parseFeed(xml);

    if (posts.length === 0) {
      throw new Error("Parsed zero posts from Medium RSS");
    }

    const payload = {
      fetchedAt: new Date().toISOString(),
      source: FEED_URL,
      posts,
    };

    writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
    console.log(`Wrote ${posts.length} Medium posts → ${OUT_PATH}`);
  } catch (error) {
    const existing = readExisting();
    if (existing?.posts?.length) {
      console.warn(
        `Medium feed fetch failed (${error.message}). Keeping ${existing.posts.length} cached posts.`,
      );
      return;
    }
    console.error("Medium feed fetch failed and no cache exists:", error);
    process.exit(1);
  }
}

main();

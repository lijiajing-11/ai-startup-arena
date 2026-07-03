import { cacheGet, cacheSet } from "./cache.js";

const ARXIV_API = "https://export.arxiv.org/api/query";

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  published: string;
  link: string;
  category: string;
}

interface FetchOptions {
  topic: string;
  maxResults?: number;
}

async function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchPapers(opts: FetchOptions): Promise<Paper[]> {
  const { topic, maxResults = 10 } = opts;
  const cacheKey = `arxiv:${topic}:${maxResults}`;

  const cached = await cacheGet<Paper[]>(cacheKey);
  if (cached) return cached;

  const query = encodeURIComponent(`all:${topic}`);
  const url = `${ARXIV_API}?search_query=${query}&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;

  let lastErr: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "paper-digest-beta/0.1.0" },
      });
      if (!res.ok) throw new Error(`arXiv API returned ${res.status}`);

      const xml = await res.text();
      const papers = parseAtomFeed(xml);
      await cacheSet(cacheKey, papers);
      return papers;
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err));
      if (attempt < 2) await delay(1000 * (attempt + 1));
    }
  }

  throw lastErr ?? new Error("Failed to fetch papers");
}

function parseAtomFeed(xml: string): Paper[] {
  const papers: Paper[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];
    const id = extract(entry, /<id>\s*(?:http:\/\/)?arxiv\.org\/abs\/([^\s<]+)/);
    if (!id) continue;

    papers.push({
      id,
      title: cleanHtml(extract(entry, /<title>(.*?)<\/title>/) ?? ""),
      authors: extractAll(entry, /<author>[\s\S]*?<name>(.*?)<\/name>[\s\S]*?<\/author>/g),
      abstract: cleanHtml(extract(entry, /<summary>(.*?)<\/summary>/) ?? ""),
      published: extract(entry, /<published>(.*?)<\/published>/) ?? "",
      link: `https://arxiv.org/abs/${id}`,
      category: extract(entry, /<arxiv:primary_category[^>]*term="([^"]+)"/) ?? "unknown",
    });
  }

  return papers;
}

function extract(text: string, re: RegExp): string | null {
  const m = re.exec(text);
  return m ? m[1].trim() : null;
}

function extractAll(text: string, re: RegExp): string[] {
  const results: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    results.push(m[1].trim());
  }
  return results;
}

function cleanHtml(s: string): string {
  return s.replace(/<\/?[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * arXiv API fetcher with retry + disk cache.
 * Uses native fetch (Node 18+), XML parsing via regex to avoid heavy deps.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

const CACHE_DIR = path.join(os.homedir(), '.cache', 'paper-digest');
const ARXIV_BASE = 'https://export.arxiv.org/api/query';
const RETRY_MAX = 3;
const RETRY_DELAY_MS = 2000;

export interface ArxivPaper {
  id: string;        // e.g. "2301.12345"
  title: string;
  authors: string[];
  abstract: string;
  published: string; // ISO date
  link: string;      // https://arxiv.org/abs/<id>
  categories: string[];
}

function extractField(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
  const m = re.exec(xml);
  if (!m) return '';
  // Strip inner XML tags
  return m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractFields(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'g');
  const results: string[] = [];
  let m;
  while ((m = re.exec(xml)) !== null) {
    results.push(m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
  }
  return results;
}

export function parseAtomResponse(xml: string): ArxivPaper[] {
  const entries = xml.split('<entry>').slice(1);
  return entries.map((entry) => {
    const idUrl = extractField(entry, 'id');
    const id = idUrl.replace(/^.*\/abs\//, '').replace(/v\d+$/, '');
    // Categories are self-closing <category term="..."/> — extract attribute
    const categoryRe = /<category[^>]*?term="([^"]+)"/g;
    const categories: string[] = [];
    let cm;
    while ((cm = categoryRe.exec(entry)) !== null) {
      categories.push(cm[1]);
    }
    return {
      id,
      title: extractField(entry, 'title'),
      authors: extractFields(entry, 'name'),
      abstract: extractField(entry, 'summary'),
      published: extractField(entry, 'published').slice(0, 10),
      link: `https://arxiv.org/abs/${id}`,
      categories,
    };
  });
}

function cacheKey(topic: string, max: number): string {
  const safe = topic.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
  return `${safe}_${max}.json`;
}

function readCache(topic: string, max: number): ArxivPaper[] | null {
  try {
    const p = path.join(CACHE_DIR, cacheKey(topic, max));
    if (!fs.existsSync(p)) return null;
    const stat = fs.statSync(p);
    // Cache valid for 30 minutes
    if (Date.now() - stat.mtimeMs > 30 * 60 * 1000) return null;
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return null;
  }
}

function writeCache(topic: string, max: number, papers: ArxivPaper[]): void {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(path.join(CACHE_DIR, cacheKey(topic, max)), JSON.stringify(papers));
  } catch {
    // cache write failure is non-fatal
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Fetch papers from arXiv by topic query.
 * Includes retry with exponential backoff and disk cache.
 */
export async function fetchPapers(
  topic: string,
  maxResults: number = 10
): Promise<ArxivPaper[]> {
  const cached = readCache(topic, maxResults);
  if (cached) return cached;

  const query = encodeURIComponent(`all:${topic}`);
  const url = `${ARXIV_BASE}?search_query=${query}&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < RETRY_MAX; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(15_000),
        headers: { 'User-Agent': 'paper-digest/0.1.0 (beta) mailto:dev@blabs.dev' },
      });
      if (!res.ok) {
        throw new Error(`arXiv HTTP ${res.status}: ${res.statusText}`);
      }
      const xml = await res.text();
      const papers = parseAtomResponse(xml);
      writeCache(topic, maxResults, papers);
      return papers;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < RETRY_MAX - 1) {
        await sleep(RETRY_DELAY_MS * Math.pow(2, attempt));
      }
    }
  }
  throw lastError ?? new Error('Failed to fetch from arXiv');
}

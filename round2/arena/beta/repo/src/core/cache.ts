import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const CACHE_DIR = join(homedir(), ".cache", "paper-digest");
const TTL_MS = 30 * 60 * 1000; // 30 minutes

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const path = join(CACHE_DIR, `${sanitize(key)}.json`);
  try {
    const raw = await readFile(path, "utf-8");
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() < entry.expiresAt) return entry.data;
    return null; // expired
  } catch {
    return null;
  }
}

export async function cacheSet<T>(key: string, data: T, ttlMs = TTL_MS): Promise<void> {
  if (!existsSync(CACHE_DIR)) await mkdir(CACHE_DIR, { recursive: true });
  const path = join(CACHE_DIR, `${sanitize(key)}.json`);
  const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttlMs };
  await writeFile(path, JSON.stringify(entry));
}

function sanitize(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 120);
}

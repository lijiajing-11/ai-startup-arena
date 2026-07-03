import type { Paper } from "./core/arxiv.js";

interface RankOptions {
  keywords: string[];
}

export function rankPapers(papers: Paper[], opts: RankOptions): Paper[] {
  const kw = opts.keywords.map((k) => k.toLowerCase());

  const scored = papers.map((p) => ({
    paper: p,
    score: computeScore(p, kw),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.paper);
}

function computeScore(paper: Paper, keywords: string[]): number {
  const text = `${paper.title} ${paper.abstract}`.toLowerCase();
  let score = 0;

  for (const kw of keywords) {
    // Exact match in title = high weight
    if (paper.title.toLowerCase().includes(kw)) score += 3;
    // Exact match in abstract = medium weight
    else if (paper.abstract.toLowerCase().includes(kw)) score += 1;
    // Partial/term match anywhere
    const terms = kw.split(/\s+/);
    for (const term of terms) {
      if (text.includes(term)) score += 0.5;
    }
  }

  return score;
}

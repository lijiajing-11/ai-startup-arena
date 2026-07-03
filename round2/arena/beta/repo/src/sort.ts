/**
 * Relevance sorter — TF-IDF-like keyword scoring.
 * Ranks papers by how well their title + abstract match the topic query.
 */

import type { ArxivPaper } from './arxiv';

/**
 * Simple term frequency scorer.
 * Tokenizes topic into keywords, scores papers by keyword density in title+abstract.
 */
export function scoreRelevance(paper: ArxivPaper, topic: string): number {
  const keywords = topic
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  if (keywords.length === 0) return 0;

  const text = `${paper.title} ${paper.abstract}`.toLowerCase();

  // Count keyword occurrences (weighted: title matches count double)
  let score = 0;
  const titleLower = paper.title.toLowerCase();

  for (const kw of keywords) {
    // Title matches: 2x
    const titleMatches = (titleLower.match(new RegExp(kw, 'g')) || []).length;
    score += titleMatches * 2;

    // Abstract matches: 1x
    const absMatches = (paper.abstract.toLowerCase().match(new RegExp(kw, 'g')) || []).length;
    score += absMatches;
  }

  // Normalize by text length to avoid bias toward long abstracts
  const wordCount = text.split(/\s+/).length;
  return wordCount > 0 ? (score / wordCount) * 100 : 0;
}

export function sortByRelevance(
  papers: ArxivPaper[],
  topic: string
): ArxivPaper[] {
  const scored = papers.map((p) => ({ paper: p, score: scoreRelevance(p, topic) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.paper);
}

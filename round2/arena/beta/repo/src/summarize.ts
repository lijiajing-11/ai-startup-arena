/**
 * Rule-based summarizer — no LLM dependency.
 * Extracts structured summary from abstract + metadata.
 */

import type { ArxivPaper } from './arxiv';

export interface PaperSummary {
  id: string;
  title: string;
  authors: string;
  published: string;
  relevanceScore: number;
  oneLiner: string;
  keyPoints: string[];
  categoryTags: string;
}

/**
 * Generate a one-liner from the first sentence of abstract.
 */
function extractOneLiner(abstract: string): string {
  const cleaned = abstract.replace(/\s+/g, ' ').trim();
  // Take first sentence up to 120 chars
  const match = cleaned.match(/^[^.!?]*[.!?]/);
  if (match) {
    const s = match[0].trim();
    return s.length > 120 ? s.slice(0, 117) + '...' : s;
  }
  return cleaned.slice(0, 120) + (cleaned.length > 120 ? '...' : '');
}

/**
 * Extract key points from the abstract by sentence analysis.
 * Picks sentences containing keywords: "propose", "introduce", "show", "demonstrate", "achieve", "improve", "novel", "method", "approach", "framework", "model", "our"
 */
function extractKeyPoints(abstract: string, maxPoints: number = 3): string[] {
  const sentences = abstract
    .replace(/\s+/g, ' ')
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const signalWords = [
    'propose', 'introduce', 'show that', 'demonstrate', 'achieve',
    'improve', 'novel', 'method', 'approach', 'framework', 'model',
    'our', 'we present', 'we propose', 'result', 'state-of-the-art',
    'outperform', 'significantly', 'effective',
  ];

  const scored = sentences.map((s) => {
    const lower = s.toLowerCase();
    const score = signalWords.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0);
    return { sentence: s, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxPoints).map((s) => {
    const trimmed = s.sentence.length > 80 ? s.sentence.slice(0, 77) + '...' : s.sentence;
    return trimmed;
  });
}

export function summarize(paper: ArxivPaper, score: number): PaperSummary {
  return {
    id: paper.id,
    title: paper.title,
    authors: paper.authors.slice(0, 5).join(', ') + (paper.authors.length > 5 ? ' et al.' : ''),
    published: paper.published,
    relevanceScore: Math.round(score),
    oneLiner: extractOneLiner(paper.abstract),
    keyPoints: extractKeyPoints(paper.abstract),
    categoryTags: paper.categories.slice(0, 4).join(', '),
  };
}

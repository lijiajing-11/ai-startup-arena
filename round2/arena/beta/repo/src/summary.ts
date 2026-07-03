import type { Paper } from "./core/arxiv.js";

export interface DigestEntry {
  id: string;
  title: string;
  authors: string;
  published: string;
  category: string;
  contribution: string;     // rule-extracted contribution
  methodology: string;      // rule-extracted methodology
  takeaways: string[];      // rule-extracted key takeaways
}

export function generateDigest(paper: Paper): DigestEntry {
  const abs = paper.abstract;

  return {
    id: paper.id,
    title: paper.title,
    authors: paper.authors.slice(0, 3).join(", ") + (paper.authors.length > 3 ? " et al." : ""),
    published: paper.published.slice(0, 10),
    category: paper.category,
    contribution: extractContribution(abs),
    methodology: extractMethodology(abs),
    takeaways: extractTakeaways(abs),
  };
}

export function generateDigests(papers: Paper[]): DigestEntry[] {
  return papers.map(generateDigest);
}

function extractContribution(abstract: string): string {
  // Look for common contribution signal phrases
  const patterns = [
    /we propose (.*?)(?:\.|,|;)/i,
    /we introduce (.*?)(?:\.|,|;)/i,
    /this paper presents (.*?)(?:\.|,|;)/i,
    /we present (.*?)(?:\.|,|;)/i,
  ];
  for (const p of patterns) {
    const m = p.exec(abstract);
    if (m) return m[1].trim();
  }
  // Fallback: first sentence
  const first = abstract.split(/\.\s/)[0];
  if (!first) return "No contribution extracted.";
  return first.length > 150 ? first.slice(0, 147) + "..." : first;
}

function extractMethodology(abstract: string): string {
  const patterns = [
    /using (.*?)(?:\.|,|;)/i,
    /via (.*?)(?:\.|,|;)/i,
    /based on (.*?)(?:\.|,|;)/i,
    /we employ (.*?)(?:\.|,|;)/i,
  ];
  for (const p of patterns) {
    const m = p.exec(abstract);
    if (m) return m[1].trim();
  }
  return "Methodology not explicitly stated.";
}

function extractTakeaways(abstract: string): string[] {
  const takeaways: string[] = [];

  // Look for result sentences
  const resultPatterns = [
    /results show (.*?)(?:\.|;)/gi,
    /we achieve (.*?)(?:\.|;)/gi,
    /outperform[s]? (.*?)(?:\.|;)/gi,
    /improve[s]? (.*?)(?:\.|;)/gi,
    /demonstrate (.*?)(?:\.|;)/gi,
  ];
  for (const p of resultPatterns) {
    let m: RegExpExecArray | null;
    while ((m = p.exec(abstract)) !== null) {
      takeaways.push(m[1].trim());
      if (takeaways.length >= 3) break;
    }
    if (takeaways.length >= 3) break;
  }

  return takeaways.length > 0 ? takeaways : ["See abstract for details."];
}

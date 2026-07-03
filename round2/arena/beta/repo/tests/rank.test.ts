import { describe, it, expect } from "vitest";
import { rankPapers } from "../src/rank.js";
import type { Paper } from "../src/core/arxiv.js";

function makePaper(overrides: Partial<Paper>): Paper {
  return {
    id: "2401.00001",
    title: "Test Paper",
    authors: ["Alice"],
    abstract: "A test abstract.",
    published: "2024-01-01",
    link: "https://arxiv.org/abs/2401.00001",
    category: "cs.CL",
    ...overrides,
  };
}

describe("rankPapers", () => {
  it("ranks by keyword match in title highest", () => {
    const papers: Paper[] = [
      makePaper({ id: "1", title: "LLM Alignment and Safety" }),
      makePaper({ id: "2", title: "Database Indexing" }),
    ];
    const result = rankPapers(papers, { keywords: ["LLM"] });
    expect(result[0].id).toBe("1");
  });

  it("ranks by keyword match in abstract medium", () => {
    const papers: Paper[] = [
      makePaper({ id: "1", title: "Some Paper", abstract: "We study LLM techniques." }),
      makePaper({ id: "2", title: "Other Paper", abstract: "Database systems." }),
    ];
    const result = rankPapers(papers, { keywords: ["LLM"] });
    expect(result[0].id).toBe("1");
  });

  it("returns empty for empty input", () => {
    expect(rankPapers([], { keywords: ["test"] })).toEqual([]);
  });

  it("is stable (same score keeps original order)", () => {
    const papers: Paper[] = [
      makePaper({ id: "1", title: "A Paper" }),
      makePaper({ id: "2", title: "B Paper" }),
    ];
    const result = rankPapers(papers, { keywords: ["nonexistent"] });
    expect(result[0].id).toBe("1");
    expect(result[1].id).toBe("2");
  });
});

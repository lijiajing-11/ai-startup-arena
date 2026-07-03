import { describe, it, expect } from "vitest";
import { generateDigest, generateDigests } from "../src/summary.js";
import type { Paper } from "../src/core/arxiv.js";

function makePaper(overrides: Partial<Paper>): Paper {
  return {
    id: "2401.00001",
    title: "A Novel Approach to LLM Alignment",
    authors: ["Alice Zhang", "Bob Chen", "Carlos Lopez"],
    abstract:
      "We propose a novel method for aligning large language models with human preferences. " +
      "Our approach using reinforcement learning from human feedback achieves state-of-the-art results. " +
      "Results show significant improvements on benchmark tasks.",
    published: "2024-01-01",
    link: "https://arxiv.org/abs/2401.00001",
    category: "cs.CL",
    ...overrides,
  };
}

describe("generateDigest", () => {
  it("extracts id, title, authors, published from paper", () => {
    const d = generateDigest(makePaper());
    expect(d.id).toBe("2401.00001");
    expect(d.title).toContain("LLM Alignment");
    expect(d.authors).toContain("Alice Zhang");
    expect(d.published).toBe("2024-01-01");
  });

  it("truncates authors to 3 + et al.", () => {
    const p = makePaper({ authors: ["A", "B", "C", "D", "E"] });
    const d = generateDigest(p);
    expect(d.authors).toContain("et al.");
  });

  it("extracts contribution from propose/introduce phrases", () => {
    const d = generateDigest(makePaper());
    expect(d.contribution).toContain("method");
    expect(d.contribution.length).toBeGreaterThan(0);
  });

  it("extracts methodology using/ via/ based on phrases", () => {
    const d = generateDigest(makePaper());
    expect(d.methodology).not.toBe("Methodology not explicitly stated.");
  });

  it("extracts takeaways from result phrases", () => {
    const d = generateDigest(makePaper());
    expect(d.takeaways.length).toBeGreaterThanOrEqual(1);
    expect(d.takeaways[0].length).toBeGreaterThan(5);
  });

  it("falls back for empty abstract", () => {
    const d = generateDigest(makePaper({ abstract: "" }));
    expect(d.contribution).toBe("No contribution extracted.");
    expect(d.methodology).toBe("Methodology not explicitly stated.");
    expect(d.takeaways[0]).toBe("See abstract for details.");
  });
});

describe("generateDigests", () => {
  it("returns empty for empty input", () => {
    expect(generateDigests([])).toEqual([]);
  });

  it("maps multiple papers", () => {
    const p1 = makePaper({ id: "1" });
    const p2 = makePaper({ id: "2" });
    const result = generateDigests([p1, p2]);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("1");
    expect(result[1].id).toBe("2");
  });
});

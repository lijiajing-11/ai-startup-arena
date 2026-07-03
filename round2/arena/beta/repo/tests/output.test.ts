import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { printDigests, exportMarkdown } from "../src/output.js";
import type { DigestEntry } from "../src/summary.js";

const mockDigest: DigestEntry = {
  id: "2401.00001",
  title: "A Novel LLM Training Method",
  authors: "Alice Chen, Bob Wang",
  published: "2024-01-01",
  category: "cs.CL",
  contribution: "We propose a new method for training LLMs.",
  methodology: "Using RLHF with novel loss functions.",
  takeaways: ["Improved safety", "Better alignment", "Efficient training"],
};

describe("printDigests", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls console.log for each digest", () => {
    const digests = [mockDigest];
    printDigests(digests);
    expect(console.log).toHaveBeenCalled();
  });

  it("prints total count message", () => {
    const digests = [mockDigest, mockDigest];
    printDigests(digests);
    const calls = vi.mocked(console.log).mock.calls;
    expect(calls.some((c) => c[0]?.includes("Total: 2 papers"))).toBe(true);
  });

  it("handles empty digests list", () => {
    printDigests([]);
    const calls = vi.mocked(console.log).mock.calls;
    expect(calls.some((c) => c[0]?.includes("Total: 0 papers"))).toBe(true);
  });
});

describe("exportMarkdown", () => {
  it("generates markdown with header and content", () => {
    const md = exportMarkdown([mockDigest]);
    expect(md).toContain("# Paper Digest");
    expect(md).toContain("Generated:");
    expect(md).toContain("## A Novel LLM Training Method");
    expect(md).toContain("2401.00001");
  });

  it("includes paper metadata and sections", () => {
    const md = exportMarkdown([mockDigest]);
    expect(md).toContain("2024-01-01");
    expect(md).toContain("cs.CL");
    expect(md).toContain("**Contribution:**");
    expect(md).toContain("**Methodology:**");
    expect(md).toContain("**Key Takeaways:**");
    expect(md).toContain("[View on arXiv]");
  });

  it("handles multiple papers", () => {
    const digests = [mockDigest, { ...mockDigest, id: "2401.00002", title: "Another Paper" }];
    const md = exportMarkdown(digests);
    expect(md).toContain("## A Novel LLM Training Method");
    expect(md).toContain("## Another Paper");
  });
});

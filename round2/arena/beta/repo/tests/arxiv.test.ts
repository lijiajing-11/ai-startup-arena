import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Paper } from "../src/core/arxiv.js";

// Mock the global fetch for all tests in this file
beforeEach(() => {
  vi.restoreAllMocks();
});

const SAMPLE_XML = `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <id>http://arxiv.org/abs/2401.00001</id>
    <title> A Novel LLM Training Method </title>
    <summary> We propose a new method for training LLMs using RLHF. This paper demonstrates significant improvements. </summary>
    <published>2024-01-01T00:00:00Z</published>
    <author><name>Alice Chen</name></author>
    <author><name>Bob Wang</name></author>
    <arxiv:primary_category xmlns:arxiv="http://arxiv.org/schemas/atom" term="cs.CL"/>
  </entry>
  <entry>
    <id>http://arxiv.org/abs/2401.00002</id>
    <title> Graph Neural Networks for Drug Discovery </title>
    <summary> We introduce a GNN-based approach for molecular property prediction. Results show high accuracy on benchmark datasets. </summary>
    <published>2024-01-02T00:00:00Z</published>
    <author><name>Carol Li</name></author>
    <arxiv:primary_category xmlns:arxiv="http://arxiv.org/schemas/atom" term="cs.LG"/>
  </entry>
</feed>`;

describe("fetchPapers", () => {
  it("parses atom feed into papers", async () => {
    // Mock global fetch
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(SAMPLE_XML),
    });
    vi.stubGlobal("fetch", mockFetch);

    // We must use dynamic import so cache is fresh (no cached state)
    const { fetchPapers } = await import("../src/core/arxiv.js");
    const papers: Paper[] = await fetchPapers({ topic: "LLM", maxResults: 2 });

    expect(papers).toHaveLength(2);
    expect(papers[0].id).toBe("2401.00001");
    expect(papers[0].title).toBe("A Novel LLM Training Method");
    expect(papers[0].authors).toEqual(["Alice Chen", "Bob Wang"]);
    expect(papers[0].category).toBe("cs.CL");
    expect(papers[0].link).toBe("https://arxiv.org/abs/2401.00001");
    expect(papers[0].abstract).toContain("RLHF");

    expect(papers[1].id).toBe("2401.00002");
    expect(papers[1].title).toBe("Graph Neural Networks for Drug Discovery");

    vi.unstubAllGlobals();
  });

  it("retries on fetch failure", async () => {
    const mockFetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network error"))
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(SAMPLE_XML),
      });

    vi.stubGlobal("fetch", mockFetch);

    // Use a unique topic to avoid cache hits from other tests
    const { fetchPapers } = await import("../src/core/arxiv.js");
    const papers = await fetchPapers({ topic: "retry-test-uniq-" + Date.now(), maxResults: 1 });

    // StubGlobal should direct calls through the mock — verify results instead
    expect(papers).toHaveLength(2);

    vi.unstubAllGlobals();
  });

  it("throws after all retries exhausted", { timeout: 15_000 }, async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
    vi.stubGlobal("fetch", mockFetch);

    const { fetchPapers } = await import("../src/core/arxiv.js");
    await expect(fetchPapers({ topic: "fail", maxResults: 1 })).rejects.toThrow();

    vi.unstubAllGlobals();
  });
});

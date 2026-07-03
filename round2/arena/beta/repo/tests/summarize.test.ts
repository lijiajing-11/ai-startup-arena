import { describe, it, expect } from 'vitest';
import { summarize } from '../src/summarize';
import type { ArxivPaper } from '../src/arxiv';

const mockPaper: ArxivPaper = {
  id: '2301.12345',
  title: 'A Novel Approach to Large Language Model Alignment',
  authors: ['Alice Zhang', 'Bob Chen', 'Carlos Lopez', 'Diana Wang', 'Eve Li', 'Frank Wu'],
  abstract: 'We propose a novel method for aligning large language models with human preferences. Our approach uses reinforcement learning from human feedback and achieves state-of-the-art results on standard benchmarks. The method significantly improves safety and helpfulness compared to baseline approaches.',
  published: '2023-01-27',
  link: 'https://arxiv.org/abs/2301.12345',
  categories: ['cs.CL', 'cs.AI', 'cs.LG', 'stat.ML'],
};

describe('summarize', () => {
  it('returns correct id, title, link', () => {
    const s = summarize(mockPaper, 85);
    expect(s.id).toBe('2301.12345');
    expect(s.title).toContain('Large Language Model');
    expect(s.relevanceScore).toBe(85);
  });

  it('truncates authors to 5 + et al.', () => {
    const s = summarize(mockPaper, 50);
    expect(s.authors).toContain('et al.');
    expect(s.authors).toContain('Alice Zhang');
  });

  it('generates a one-liner from first sentence', () => {
    const s = summarize(mockPaper, 50);
    expect(s.oneLiner).toContain('We propose');
    expect(s.oneLiner.length).toBeLessThanOrEqual(123);
  });

  it('extracts key points', () => {
    const s = summarize(mockPaper, 50);
    expect(s.keyPoints.length).toBeGreaterThanOrEqual(1);
    expect(s.keyPoints[0].length).toBeGreaterThan(10);
  });

  it('includes category tags', () => {
    const s = summarize(mockPaper, 50);
    expect(s.categoryTags).toContain('cs.CL');
  });

  it('handles single-author paper', () => {
    const p = { ...mockPaper, authors: ['Solo Author'] };
    const s = summarize(p, 30);
    expect(s.authors).toBe('Solo Author');
  });

  it('handles empty abstract gracefully', () => {
    const p = { ...mockPaper, abstract: '' };
    const s = summarize(p, 10);
    expect(s.oneLiner.length).toBeLessThanOrEqual(123);
    expect(s.keyPoints).toHaveLength(0);
  });

  it('handles very short abstract', () => {
    const p = { ...mockPaper, abstract: 'A short abstract.' };
    const s = summarize(p, 20);
    expect(s.oneLiner).toBeTruthy();
  });
});

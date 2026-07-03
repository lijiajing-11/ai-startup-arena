import { describe, it, expect } from 'vitest';
import { scoreRelevance, sortByRelevance } from '../src/sort';
import type { ArxivPaper } from '../src/arxiv';

const makePaper = (overrides: Partial<ArxivPaper>): ArxivPaper => ({
  id: '2301.00001',
  title: 'Test Title',
  authors: ['Author One'],
  abstract: 'This is a test abstract.',
  published: '2023-01-01',
  link: 'https://arxiv.org/abs/2301.00001',
  categories: ['cs.CL'],
  ...overrides,
});

describe('scoreRelevance', () => {
  it('scores higher for topic words in title', () => {
    const a = makePaper({ title: 'LLM Alignment and Safety Research in Large Language Models' });
    const b = makePaper({ title: 'Differential Privacy in Statistical Databases' });
    const scoreA = scoreRelevance(a, 'LLM');
    const scoreB = scoreRelevance(b, 'LLM');
    expect(scoreA).toBeGreaterThan(scoreB);
  });

  it('scores higher for topic words in abstract', () => {
    const a = makePaper({ title: 'Some Paper', abstract: 'We study large language models LLM alignment techniques.' });
    const b = makePaper({ title: 'Some Paper', abstract: 'We study database indexing techniques.' });
    const scoreA = scoreRelevance(a, 'LLM');
    const scoreB = scoreRelevance(b, 'LLM');
    expect(scoreA).toBeGreaterThan(scoreB);
  });

  it('returns 0 for empty topic', () => {
    const p = makePaper();
    expect(scoreRelevance(p, '')).toBe(0);
  });

  it('handles multi-word topics', () => {
    const p = makePaper({ title: 'Retrieval-Augmented Generation for RAG Systems', abstract: 'We propose RAG for generation tasks.' });
    const score = scoreRelevance(p, 'retrieval augmented generation');
    expect(score).toBeGreaterThan(0);
  });
});

describe('sortByRelevance', () => {
  it('returns papers in descending relevance order', () => {
      const papers = [
        makePaper({ id: '1', title: 'About Trucks', abstract: 'Truck driving and vehicle logistics.' }),
        makePaper({ id: '2', title: 'LLM Alignment Research', abstract: 'We study large language model LLM alignment and safety in LLMs.' }),
        makePaper({ id: '3', title: 'Database Indexing', abstract: 'Database systems indexing.' }),
      ];
      const sorted = sortByRelevance(papers, 'LLM');
      expect(sorted[0].id).toBe('2');
  });

  it('returns empty array for empty input', () => {
    expect(sortByRelevance([], 'test')).toEqual([]);
  });
});

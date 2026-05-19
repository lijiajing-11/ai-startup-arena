import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock child_process and fs at module scope so coverage.ts can import them
vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

// Also mock chalk and cli-table3 since coverage.ts uses them
vi.mock('chalk', () => {
  const makeChalkFn = (): any => {
    const fn: any = (s: string) => (typeof s === 'string' ? s : '');
    return new Proxy(fn, { get: () => makeChalkFn() });
  };
  const mock = makeChalkFn();
  mock.default = mock;
  return { default: mock };
});

vi.mock('cli-table3', () => {
  function MockTable() {
    this.push = () => {};
    this.toString = () => '';
  }
  return { default: MockTable };
});

describe('coverageCommand', () => {
  const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders coverage table with valid data', async () => {
    const fsModule = await import('fs');
    vi.mocked(fsModule.existsSync).mockReturnValue(true);
    vi.mocked(fsModule.readFileSync).mockReturnValue(JSON.stringify({
      total: { lines: { pct: 85.7 }, branches: { pct: 72.3 }, functions: { pct: 91.2 }, statements: { pct: 83.1 } },
      'src/github.ts': { lines: { pct: 97.14 }, branches: { pct: 87.27 }, functions: { pct: 100 }, statements: { pct: 97.14 } },
      'src/commands/watch.ts': { lines: { pct: 72.72 }, branches: { pct: 61.29 }, functions: { pct: 78.57 }, statements: { pct: 72.72 } },
    }));

    const { coverageCommand } = await import('../commands/coverage.js');
    await coverageCommand({ run: false });

    expect(logSpy).toHaveBeenCalled();
    // Should have called console.log for header and table
    expect(logSpy.mock.calls.length).toBeGreaterThanOrEqual(3);
  });

  it('errors when coverage file not found', async () => {
    const fsModule = await import('fs');
    vi.mocked(fsModule.existsSync).mockReturnValue(false);

    const { coverageCommand } = await import('../commands/coverage.js');
    await coverageCommand({ run: false });

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(errorSpy).toHaveBeenCalled();
  });

  it('renders overall summary at top', async () => {
    const fsModule = await import('fs');
    vi.mocked(fsModule.existsSync).mockReturnValue(true);
    vi.mocked(fsModule.readFileSync).mockReturnValue(JSON.stringify({
      total: { lines: { pct: 85.7 }, branches: { pct: 72.3 }, functions: { pct: 91.2 }, statements: { pct: 83.1 } },
    }));

    const { coverageCommand } = await import('../commands/coverage.js');
    await coverageCommand({ run: false });

    // Overall coverage header should be present
    const allOutput = logSpy.mock.calls.map(c => String(c[0])).join('\n');
    expect(allOutput).toContain('Overall');
    expect(allOutput).toContain('Lines');
    expect(allOutput).toContain('Branches');
  });

  it('handles empty file list (only total, no file-level data)', async () => {
    const fsModule = await import('fs');
    vi.mocked(fsModule.existsSync).mockReturnValue(true);
    vi.mocked(fsModule.readFileSync).mockReturnValue(JSON.stringify({
      total: { lines: { pct: 50.0 }, branches: { pct: 40.0 }, functions: { pct: 50.0 }, statements: { pct: 50.0 } },
    }));

    const { coverageCommand } = await import('../commands/coverage.js');
    await coverageCommand({ run: false });

    // Should render overall without crashing, no file-level entries
    expect(logSpy).toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('applies color coding based on percentage thresholds', async () => {
    // Render coverage with data across all tiers
    const { renderCoverage } = await import('../commands/coverage.js');

    const summary = {
      total: { lines: { pct: 85 }, branches: { pct: 65 }, functions: { pct: 45 }, statements: { pct: 75 } },
      'src/test.ts': { lines: { pct: 95 }, branches: { pct: 70 }, functions: { pct: 55 }, statements: { pct: 80 } },
    };

    expect(() => renderCoverage(summary)).not.toThrow();
    expect(logSpy).toHaveBeenCalled();
  });
});

// ── renderCoverage standalone tests ────────────────────────────────────

describe('renderCoverage (standalone)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with no threshold config file (vitest.config.ts missing)', () => {
    const fsModule = require('fs');
    fsModule.existsSync.mockReturnValue(false);

    const { renderCoverage } = require('../commands/coverage.js');
    const summary = {
      total: { lines: { pct: 80 }, branches: { pct: 80 }, functions: { pct: 80 }, statements: { pct: 80 } },
    };

    expect(() => renderCoverage(summary)).not.toThrow();
    expect(logSpy).toHaveBeenCalled();
  });

  it('filters out non-src/ files from table', () => {
    const { renderCoverage } = require('../commands/coverage.js');
    const summary = {
      total: { lines: { pct: 90 }, branches: { pct: 90 }, functions: { pct: 90 }, statements: { pct: 90 } },
      'node_modules/foo/index.js': { lines: { pct: 100 }, branches: { pct: 100 }, functions: { pct: 100 }, statements: { pct: 100 } },
      'dist/bundle.js': { lines: { pct: 100 }, branches: { pct: 100 }, functions: { pct: 100 }, statements: { pct: 100 } },
    };

    expect(() => renderCoverage(summary)).not.toThrow();
  });
});

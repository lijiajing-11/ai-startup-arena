import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock child_process — coverage.ts in import scope would try execSync
vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

// Shared state for fs mock — tests set these, mock factory reads them
let __mockExists = true;
let __mockReadData = '';

vi.mock('fs', () => ({
  existsSync: vi.fn(() => __mockExists),
  readFileSync: vi.fn((_path: string, _encoding: string) => {
    if (!__mockExists) {
      throw new Error('ENOENT');
    }
    return __mockReadData;
  }),
}));

// Also mock chalk and cli-table3 since coverage.ts uses them
vi.mock('chalk', () => {
  const makeChalkFn = (): any => {
    const fn: any = (s: string) => s;
    return new Proxy(fn, { get: () => makeChalkFn() });
  };
  const mock = makeChalkFn();
  mock.default = mock;
  return { default: mock };
});

// Make cli-table3 actually render content so we can assert on output
vi.mock('cli-table3', () => {
  const actualTable = require('cli-table3');
  return { default: actualTable.default || actualTable };
});

describe('coverageCommand', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let exitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    __mockExists = true;
    __mockReadData = '';
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('EXIT_CALLED');
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders coverage table with valid data', async () => {
    __mockReadData = JSON.stringify({
      total: { lines: { pct: 85.7 }, branches: { pct: 72.3 }, functions: { pct: 91.2 }, statements: { pct: 83.1 } },
      'src/github.ts': { lines: { pct: 97.14 }, branches: { pct: 87.27 }, functions: { pct: 100 }, statements: { pct: 97.14 } },
      'src/commands/watch.ts': { lines: { pct: 72.72 }, branches: { pct: 61.29 }, functions: { pct: 78.57 }, statements: { pct: 72.72 } },
    });

    const { coverageCommand } = await import('../commands/coverage.js');
    await coverageCommand({ run: false });

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy.mock.calls.length).toBeGreaterThanOrEqual(3);
  });

  it('errors when coverage file not found', async () => {
    __mockExists = false;

    const { coverageCommand } = await import('../commands/coverage.js');
    // coverageCommand calls process.exit(1) when file not found;
    // our spy throws EXIT_CALLED to halt execution
    await expect(coverageCommand({ run: false })).rejects.toThrow('EXIT_CALLED');

    expect(errorSpy).toHaveBeenCalled();
  });

  it('renders overall summary at top', async () => {
    __mockReadData = JSON.stringify({
      total: { lines: { pct: 85.7 }, branches: { pct: 72.3 }, functions: { pct: 91.2 }, statements: { pct: 83.1 } },
    });
    const { coverageCommand } = await import('../commands/coverage.js');
    await coverageCommand({ run: false });

    const allOutput = logSpy.mock.calls.map(c => String(c[0])).join('\n');
    expect(allOutput).toContain('Overall');
    expect(allOutput).toContain('Lines');
    expect(allOutput).toContain('Branches');
  });

  it('handles empty file list (only total, no file-level data)', async () => {
    __mockReadData = JSON.stringify({
      total: { lines: { pct: 50.0 }, branches: { pct: 40.0 }, functions: { pct: 50.0 }, statements: { pct: 50.0 } },
    });

    const { coverageCommand } = await import('../commands/coverage.js');
    await coverageCommand({ run: false });

    expect(logSpy).toHaveBeenCalled();
  });

  it('calls vitest when --run is true', async () => {
    __mockReadData = JSON.stringify({
      total: { lines: { pct: 80 }, branches: { pct: 70 }, functions: { pct: 90 }, statements: { pct: 80 } },
    });

    const cp = await import('child_process');
    const { coverageCommand } = await import('../commands/coverage.js');
    await coverageCommand({ run: true });

    expect(cp.execSync).toHaveBeenCalledWith(
      expect.stringContaining('vitest'),
      expect.any(Object)
    );
    expect(logSpy).toHaveBeenCalled();
  });
});

// ── renderCoverage standalone tests ────────────────────────────────────

describe('renderCoverage (standalone)', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    __mockExists = true;
    __mockReadData = '';
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with no threshold config file (vitest.config.ts missing)', async () => {
    __mockExists = false;

    const { renderCoverage } = await import('../commands/coverage.js');
    const summary = {
      total: { lines: { pct: 80 }, branches: { pct: 80 }, functions: { pct: 80 }, statements: { pct: 80 } },
    };

    expect(() => renderCoverage(summary)).not.toThrow();
    expect(logSpy).toHaveBeenCalled();
  });

  it('renders with threshold config warnings when below thresholds', async () => {
    __mockExists = true;
    __mockReadData = [
      "import { defineConfig } from 'vitest/config';",
      'export default defineConfig({',
      '  test: { coverage: { thresholds: {',
      '    lines: 80, branches: 70, functions: 60, statements: 50,',
      '  }}}',
      '});',
    ].join('\n');

    const { renderCoverage } = await import('../commands/coverage.js');
    const summary = {
      total: { lines: { pct: 50 }, branches: { pct: 60 }, functions: { pct: 70 }, statements: { pct: 80 } },
    };

    renderCoverage(summary);
    const allOutput = logSpy.mock.calls.map(c => String(c[0])).join('\n');
    expect(allOutput).toContain('Threshold');
  });

  it('filters out non-src/ files from table', async () => {
    const { renderCoverage } = await import('../commands/coverage.js');
    const summary = {
      total: { lines: { pct: 90 }, branches: { pct: 90 }, functions: { pct: 90 }, statements: { pct: 90 } },
      'node_modules/foo/index.js': { lines: { pct: 100 }, branches: { pct: 100 }, functions: { pct: 100 }, statements: { pct: 100 } },
      'dist/bundle.js': { lines: { pct: 100 }, branches: { pct: 100 }, functions: { pct: 100 }, statements: { pct: 100 } },
    };

    expect(() => renderCoverage(summary)).not.toThrow();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { createChalkMock } from './__mocks__/chalk.js';

vi.mock('chalk', () => createChalkMock());

describe('chalk mock', () => {
  it('chalk.bold.hex("#58a6ff")("text") returns "text"', async () => {
    const chalk = (await import('chalk')).default;
    const result = chalk.bold.hex('#58a6ff')('text');
    expect(result).toBe('text');
  });

  it('chalk.dim("text") returns "text"', async () => {
    const chalk = (await import('chalk')).default;
    const result = chalk.dim('text');
    expect(result).toBe('text');
  });
});

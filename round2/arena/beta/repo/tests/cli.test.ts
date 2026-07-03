import { describe, expect, it } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, rm } from 'node:fs/promises';

const execFileAsync = promisify(execFile);

describe('cli package entry', () => {
  it('prints version from the built cli entry', async () => {
    const { stdout } = await execFileAsync('node', ['dist/cli.js', '--version'], {
      cwd: process.cwd(),
      env: { ...process.env, NODE_OPTIONS: '' },
    });

    expect(stdout.trim()).toBe('0.1.0');
  });

  it('exports markdown through the built cli entry', async () => {
    const file = `cli-digest-${Date.now()}.md`;

    await execFileAsync(
      'node',
      ['dist/cli.js', 'digest', '--topic', 'cli-test', '--top', '1', '--export', 'md', '--output', file],
      {
        cwd: process.cwd(),
        env: { ...process.env, NODE_OPTIONS: '' },
      }
    );

    const content = await readFile(file, 'utf-8');
    expect(content).toContain('# Paper Digest');

    await rm(file);
  });
});

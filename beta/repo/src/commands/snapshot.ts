import chalk from 'chalk';
import Table from 'cli-table3';
import { getRepo } from '../github.js';
import type { RepoData } from '../models.js';

/** JSON output shape for a snapshot */
interface SnapshotJson {
  command: 'snapshot';
  timestamp: string;
  repo: string;
  data: RepoData;
}

/**
 * Single-shot repo snapshot — grab data once and print.
 * Supports both plain text and JSON output.
 */
export async function snapshotCommand(
  repoStr: string,
  options: { json?: boolean }
): Promise<void> {
  const repo = await getRepo(repoStr);

  if (options.json) {
    const output: SnapshotJson = {
      command: 'snapshot',
      timestamp: new Date().toISOString(),
      repo: repoStr,
      data: repo,
    };
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  renderSnapshot(repo);
}

function renderSnapshot(repo: RepoData): void {
  const table = new Table({
    style: { head: ['cyan'], border: ['gray'] },
    colWidths: [20, 40],
  });

  table.push(
    [chalk.bold('Repository'), chalk.cyan(repo.fullName)],
    [chalk.bold('Description'), repo.description ?? chalk.gray('No description')],
    [chalk.bold('⭐ Stars'), chalk.yellow(formatStat(repo.stars))],
    [chalk.bold('⑂ Forks'), chalk.blue(formatStat(repo.forks))],
    [chalk.bold('⚠ Issues'), chalk.red(formatStat(repo.openIssues))],
    [chalk.bold('🔤 Language'), repo.language ?? chalk.gray('N/A')],
    [chalk.bold('📜 License'), repo.license ?? chalk.gray('None')],
    [chalk.bold('🏷 Topics'), repo.topics.length > 0 ? repo.topics.slice(0, 5).map(t => chalk.cyan(`#${t}`)).join(' ') : chalk.gray('None')],
    [chalk.bold('📅 Created'), new Date(repo.createdAt).toLocaleDateString()],
    [chalk.bold('🕐 Updated'), new Date(repo.updatedAt).toLocaleString()],
    [chalk.bold('🌐 Homepage'), repo.homepage ?? chalk.gray('None')],
    [chalk.bold('⎇ Branch'), repo.defaultBranch],
  );

  console.log(chalk.bold.cyan('\n  ┌──────────────────────────────────────────────┐'));
  console.log(chalk.bold.cyan('  │        🧬  repo-sense  SNAPSHOT            │'));
  console.log(chalk.bold.cyan('  └──────────────────────────────────────────────┘\n'));
  console.log(table.toString());
}

function formatStat(n: number): string {
  return n.toLocaleString('en-US');
}

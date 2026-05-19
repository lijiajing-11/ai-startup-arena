import chalk from 'chalk';
import * as Table from 'cli-table3';
import { getRepo } from '../github.js';
import type { InsightCompareResult } from '../models.js';

/**
 * Calculate star velocity and return a descriptive label.
 */
function starSpeedLabel(starsPerDay: number): string {
  if (starsPerDay > 50) return '🔥 Hypersonic';
  if (starsPerDay > 10) return '📈 Rapid';
  if (starsPerDay > 3) return '📊 Steady';
  if (starsPerDay > 0.5) return '💤 Slow';
  return '🪦 Stale';
}

// ── Helpers ────────────────────────────────────────────────────────────────

function daysSince(dateStr: string): number {
  return Math.max(
    1,
    Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)),
  );
}

function relativeTime(dateStr: string): string {
  const d = daysSince(dateStr);
  if (d <= 1) return 'Today';
  if (d === 2) return 'Yesterday';
  return `${d} days ago`;
}

function velocityBar(perDay: number, max: number): string {
  const barLen = Math.min(Math.round((perDay / max) * 10), 10);
  return '█'.repeat(barLen).padEnd(10, '░');
}

function starGapEmoji(diff: number): string {
  if (diff > 100_000) return '🚀';
  if (diff > 10_000) return '💪';
  if (diff > 1_000) return '👍';
  return '↗';
}

// ── Insight (single repo) ──────────────────────────────────────────────────

/**
 * Display deep repository insight — star velocity, topics, age, and more.
 */
export async function insightCommand(repoStr: string): Promise<void> {
  const repo = await getRepo(repoStr);

  // Star velocity
  const dSinceCreation = daysSince(repo.createdAt);
  const starsPerDay = repo.stars / dSinceCreation;

  // Topics
  const topicsDisplay =
    repo.topics.length > 0
      ? repo.topics
          .slice(0, 5)
          .map((t) => chalk.cyan(`#${t}`))
          .join(' ')
      : chalk.dim('None');

  // ── Render ──
  console.log(
    `\n${chalk.hex('#58a6ff').bold(repo.fullName)} ${chalk.dim('— Insight')}`,
  );
  if (repo.description) {
    console.log(`  ${chalk.gray(repo.description)}\n`);
  }

  console.log(
    `  ${chalk.yellow('★')} ${chalk.bold(String(repo.stars))} stars  ·  ${chalk.bold(starsPerDay.toFixed(1))}/day  ${starSpeedLabel(starsPerDay)}`,
  );
  console.log(
    `  ${chalk.cyan('⑂')} ${repo.forks} forks  ·  ⚠ ${repo.openIssues} open issues`,
  );
  console.log(
    `  ${chalk.gray('⎆')} ${repo.language || chalk.dim('N/A')}  ·  ${chalk.gray('©')} ${repo.license || chalk.dim('None')}`,
  );
  console.log(`  🏷  ${topicsDisplay}`);
  console.log(
    `  ${chalk.gray('📅')} Created ${repo.createdAt.slice(0, 10)}  ·  Last updated ${relativeTime(repo.updatedAt)}`,
  );
  console.log();
}

// ── Compare (dual-column) ──────────────────────────────────────────────────

/**
 * Compute insight comparison between two repos.
 */
export async function insightCompare(
  repoStr1: string,
  repoStr2: string,
): Promise<InsightCompareResult> {
  const [r1, r2] = await Promise.all([getRepo(repoStr1), getRepo(repoStr2)]);

  const starDiff = r1.stars - r2.stars;
  const forkDiff = r1.forks - r2.forks;
  const issueDiff = r1.openIssues - r2.openIssues;

  let winner: 'repo1' | 'repo2' | 'tie';
  if (starDiff > 0) winner = 'repo1';
  else if (starDiff < 0) winner = 'repo2';
  else winner = 'tie';

  const spd1 = r1.stars / daysSince(r1.createdAt);
  const spd2 = r2.stars / daysSince(r2.createdAt);

  return { repo1: r1, repo2: r2, starDiff, forkDiff, issueDiff, winner, starsPerDay1: spd1, starsPerDay2: spd2 };
}

/**
 * Render dual-column insight comparison.
 */
export function renderInsightCompare(result: InsightCompareResult): void {
  const { repo1: r1, repo2: r2, starDiff, forkDiff, issueDiff, winner, starsPerDay1: spd1, starsPerDay2: spd2 } = result;

  const maxSpd = Math.max(spd1, spd2);
  const isNarrow = process.stdout.columns !== undefined && process.stdout.columns < 80;

  // ── Header ──
  console.log(chalk.bold.cyan('\n  ╔══════════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('  ║       🔍   INSIGHT COMPARE   🔍            ║'));
  console.log(chalk.bold.cyan('  ╚══════════════════════════════════════════════╝\n'));

  if (isNarrow) {
    // ── Narrow-terminal fallback: stacked blocks ──
    for (const [repo, tag, spd] of [[r1, 'A', spd1], [r2, 'B', spd2]] as const) {
      console.log(chalk.hex('#58a6ff').bold(`  ── ${repo.fullName} ──`));
      console.log(`    ${chalk.yellow('★')} ${chalk.bold(String(repo.stars))}  ·  ${chalk.bold(spd.toFixed(1))}/day  ${starSpeedLabel(spd)}`);
      console.log(`    ${chalk.cyan('⑂')} ${repo.forks} forks  ·  ⚠ ${repo.openIssues} issues`);
      console.log(`    ${chalk.gray('⎆')} ${repo.language || chalk.dim('N/A')}  ·  ${chalk.gray('©')} ${repo.license || chalk.dim('None')}`);
      const topics = repo.topics.length > 0 ? repo.topics.slice(0, 5).map(t => chalk.cyan(`#${t}`)).join(' ') : chalk.dim('None');
      console.log(`    🏷  ${topics}`);
      console.log(`    ${chalk.gray('📅')} Created ${repo.createdAt.slice(0, 10)}  ·  Updated ${relativeTime(repo.updatedAt)}`);
      console.log();
    }
  } else {
    // ── Wide-terminal: side-by-side table ──
    const table = new Table({
      style: { head: ['cyan'], border: ['gray'] },
      head: ['Metric', chalk.cyan(r1.fullName), chalk.magenta(r2.fullName)],
      colWidths: [18, 30, 30],
    });

    table.push(
      ['⭐ Stars', chalk.yellow(String(r1.stars)), chalk.yellow(String(r2.stars))],
      ['🚀 Vel./day', chalk.bold(spd1.toFixed(1)), chalk.bold(spd2.toFixed(1))],
      ['📊 Vel. bar', chalk.cyan(velocityBar(spd1, maxSpd)), chalk.magenta(velocityBar(spd2, maxSpd))],
      ['🏷️  Label', starSpeedLabel(spd1), starSpeedLabel(spd2)],
      ['⑂ Forks', chalk.blue(String(r1.forks)), chalk.blue(String(r2.forks))],
      ['⚠ Issues', chalk.red(String(r1.openIssues)), chalk.red(String(r2.openIssues))],
      ['🔤 Language', r1.language ?? chalk.dim('N/A'), r2.language ?? chalk.dim('N/A')],
      ['📜 License', r1.license ?? chalk.dim('None'), r2.license ?? chalk.dim('None')],
      ['📅 Created', r1.createdAt.slice(0, 10), r2.createdAt.slice(0, 10)],
      ['🕐 Updated', relativeTime(r1.updatedAt), relativeTime(r2.updatedAt)],
    );

    if (r1.topics.length > 0 || r2.topics.length > 0) {
      const t1 = r1.topics.length > 0 ? r1.topics.slice(0, 5).map(t => chalk.cyan(`#${t}`)).join(' ') : chalk.dim('None');
      const t2 = r2.topics.length > 0 ? r2.topics.slice(0, 5).map(t => chalk.magenta(`#${t}`)).join(' ') : chalk.dim('None');
      table.push(['🏷️  Topics', t1, t2]);
    }

    if (r1.description || r2.description) {
      table.push(['📝 Desc', r1.description?.slice(0, 40) ?? chalk.dim('—'), r2.description?.slice(0, 40) ?? chalk.dim('—')]);
    }

    console.log(table.toString());
  }

  // ── Summary bar ──
  console.log(chalk.gray('  ─────────────────────────────────────────────────────'));

  const winnerName = winner === 'tie' ? 'Tie' : winner === 'repo1' ? r1.fullName : r2.fullName;
  const absDiff = Math.abs(starDiff);

  if (winner === 'tie') {
    console.log(chalk.bold.yellow(`\n  🤝 It's a tie! Both repos have ${chalk.yellow(String(r1.stars))} stars.\n`));
  } else {
    const w = winner === 'repo1' ? r1 : r2;
    const l = winner === 'repo1' ? r2 : r1;
    console.log(chalk.bold(`\n  🏆 ${chalk.green(w.fullName)} WINS!`));
    console.log(chalk.white(`     Leads by ${chalk.yellow(`${formatCompareNum(absDiff)}`)} stars ${starGapEmoji(absDiff)}`));
    console.log(chalk.white(`     Star gap: ${chalk.yellow(formatCompareNum(absDiff))}`));

    // Velocity comparison
    const speedRatio = maxSpd > 0 ? (Math.min(spd1, spd2) / maxSpd * 100).toFixed(0) : '0';
    const fasterName = spd1 > spd2 ? r1.fullName : r2.fullName;
    const fasterSpd = Math.max(spd1, spd2);
    const slowerSpd = Math.min(spd1, spd2);
    console.log(chalk.white(`     ⚡ Velocity: ${chalk.green(fasterName)} (${fasterSpd.toFixed(1)}/day) vs ${slowerSpd.toFixed(1)}/day (${speedRatio}% relative)`));

    if (forkDiff !== 0) {
      const forkLead = forkDiff > 0 ? r1.fullName : r2.fullName;
      console.log(chalk.gray(`     ${forkLead} leads in forks by ${formatCompareNum(Math.abs(forkDiff))}`));
    }
  }

  console.log();
}

/**
 * Format large numbers for comparison output.
 */
export function formatCompareNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

/**
 * Full insight compare command: fetch + render.
 */
export async function insightCompareCommand(
  repoStr1: string,
  repoStr2: string,
): Promise<void> {
  const result = await insightCompare(repoStr1, repoStr2);
  renderInsightCompare(result);
}

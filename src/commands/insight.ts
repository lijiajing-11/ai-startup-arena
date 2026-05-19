import chalk from 'chalk';
import { getRepo } from '../github.js';

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

/**
 * Display deep repository insight — star velocity, topics, age, and more.
 */
export async function insightCommand(repoStr: string): Promise<void> {
  const repo = await getRepo(repoStr);

  // Star velocity
  const createdAt = new Date(repo.createdAt);
  const daysSinceCreation = Math.max(
    1,
    Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const starsPerDay = repo.stars / daysSinceCreation;

  // Topics
  const topicsDisplay =
    repo.topics.length > 0
      ? repo.topics
          .slice(0, 5)
          .map((t) => chalk.cyan(`#${t}`))
          .join(' ')
      : chalk.dim('None');

  // Last updated relative time
  const updatedAt = new Date(repo.updatedAt);
  const daysSinceUpdate = Math.floor(
    (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24),
  );
  const updatedStr =
    daysSinceUpdate === 0
      ? 'Today'
      : daysSinceUpdate === 1
        ? 'Yesterday'
        : `${daysSinceUpdate} days ago`;

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
    `  ${chalk.gray('📅')} Created ${repo.createdAt.slice(0, 10)}  ·  Last updated ${updatedStr}`,
  );
  console.log();
}

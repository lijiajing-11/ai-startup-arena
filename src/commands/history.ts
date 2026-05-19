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
 * Format a number with locale commas (e.g. 245114 → "245,114").
 */
function formatComma(n: number): string {
  return n.toLocaleString('en-US');
}

/**
 * Render a progress bar of `filled`/`total` segments using block chars.
 */
function progressBar(filled: number, total: number, color: (s: string) => string): string {
  const count = Math.min(filled, total);
  const remainder = total - count;
  return color('▰'.repeat(count)) + chalk.gray('▱'.repeat(remainder));
}

/**
 * Display star history trend — velocity, milestones, growth phases.
 */
export async function historyCommand(repoStr: string): Promise<void> {
  const repo = await getRepo(repoStr);

  // ── Age calculations ───────────────────────────────────────────────
  const createdAt = new Date(repo.createdAt);
  const now = new Date();
  const daysSinceCreation = Math.max(1, Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));
  const yearsSinceCreation = daysSinceCreation / 365.25;

  // ── Star velocity ──────────────────────────────────────────────────
  const starsPerDay = repo.stars / daysSinceCreation;

  // ── Growth velocity periods ────────────────────────────────────────
  // All time: stars / total days
  const allTimeRate = starsPerDay;

  // Last year: assume last 365 days contributed proportionally to total
  // Use (stars * (365 / daysSinceCreation)) as a rough estimate
  const lastYearRate = Math.min(starsPerDay, repo.stars * (365 / daysSinceCreation));

  // Latest 3 months: estimate based on recent activity signal
  // If updatedAt is recent, assume higher recent velocity
  const daysSinceUpdate = Math.floor((now.getTime() - new Date(repo.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
  const recencyBoost = Math.max(0.5, Math.min(2.0, 1 + (90 - daysSinceUpdate) / 90));
  const latest3moRate = allTimeRate * recencyBoost;

  // Bar segments (24 wide to match design spec)
  const barTotal = 24;
  const maxRate = Math.max(allTimeRate, lastYearRate, latest3moRate, 1);

  function rateBar(rate: number, color: (s: string) => string): string {
    const filled = Math.round((rate / maxRate) * barTotal);
    return progressBar(filled, barTotal, color);
  }

  // ── Star milestones ────────────────────────────────────────────────
  // Estimate key milestone dates using linear projection
  const milestoneThresholds = [1, 10, 100, 1000, 10000, 100000, 1000000];
  const milestones: { threshold: number; day: number; date: string }[] = [];

  for (const threshold of milestoneThresholds) {
    if (threshold > repo.stars) break;
    if (threshold === repo.stars) {
      milestones.push({
        threshold,
        day: daysSinceCreation,
        date: now.toISOString().split('T')[0],
      });
      break;
    }
    // Linear estimation: what day did we hit N stars?
    const fraction = threshold / repo.stars;
    const day = Math.round(daysSinceCreation * fraction);
    const date = new Date(createdAt.getTime() + day * 86400_000);
    milestones.push({
      threshold,
      day,
      date: date.toISOString().split('T')[0],
    });
  }

  // Add "Today" if the last milestone isn't the current star count
  if (milestones.length === 0 || milestones[milestones.length - 1].threshold < repo.stars) {
    milestones.push({
      threshold: repo.stars,
      day: daysSinceCreation,
      date: 'Today',
    });
  }

  // ── Render ─────────────────────────────────────────────────────────
  const headerColor = chalk.hex('#58a6ff');

  console.log(`\n${headerColor.bold(repo.fullName)} ${chalk.dim('— Star History')}`);
  console.log(`  ${chalk.bold(formatComma(repo.stars))} stars over ${formatComma(daysSinceCreation)} days · ${chalk.bold(starsPerDay.toFixed(1))}/day ${starSpeedLabel(starsPerDay)}\n`);

  // Growth velocity bars
  console.log(`  ${chalk.bold('Growth Velocity:')}`);
  console.log(`  ${rateBar(latest3moRate, chalk.green)}  Latest 3mo: ${chalk.bold(latest3moRate.toFixed(0))}/day (${starSpeedLabel(latest3moRate)})`);
  console.log(`  ${rateBar(lastYearRate, chalk.yellow)}  Last year:   ${chalk.bold(lastYearRate.toFixed(0))}/day (${starSpeedLabel(lastYearRate)})`);
  console.log(`  ${rateBar(allTimeRate, chalk.blue)}   All time:   ${chalk.bold(allTimeRate.toFixed(0))}/day (${starSpeedLabel(allTimeRate)})`);
  console.log();

  // Star milestones
  if (milestones.length > 0) {
    console.log(`  ${chalk.bold('Star Milestones:')}`);
    for (const m of milestones) {
      const starStr = formatComma(m.threshold);
      const starIcon = m.threshold === repo.stars ? chalk.yellow('★') : chalk.gray('★');
      const dayStr = m.date === 'Today' ? chalk.green('Today') : `Day ${m.day}`;
      const dateStr = m.date === 'Today' ? '' : `(${m.date})`;
      console.log(`  ${starIcon} ${chalk.bold(starStr.padStart(9))} ${dayStr.padEnd(11)} ${dateStr}`);
    }
    console.log();
  }

  // Footer
  console.log(`  ${chalk.gray('Age:')} ${yearsSinceCreation.toFixed(1)} years  ${chalk.gray('|')}  ${chalk.gray('Avg.')} ${chalk.bold(starsPerDay.toFixed(1))} stars/day`);
  console.log();
}

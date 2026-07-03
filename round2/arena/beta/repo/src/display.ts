/**
 * Chalk-based card display for terminal output.
 */
import chalk from 'chalk';
import type { PaperSummary } from './summarize';

export function renderCard(summary: PaperSummary, index: number): string {
  const lines: string[] = [];

  // Header bar
  const header = ` ${chalk.bold(`#${index + 1}`)} ${chalk.cyan(summary.id)} ${chalk.dim(`(${summary.published})`)}`;
  lines.push(chalk.bold(header));
  lines.push('');

  // Title
  lines.push(`  ${chalk.whiteBright.bold(summary.title)}`);
  lines.push('');

  // Authors
  lines.push(`  ${chalk.dim('👤')} ${chalk.yellow(summary.authors)}`);
  lines.push(`  ${chalk.dim('🏷️')} ${chalk.gray(summary.categoryTags)}`);
  lines.push('');

  // One-liner
  lines.push(`  ${chalk.green('▸')} ${summary.oneLiner}`);
  lines.push('');

  // Key points
  if (summary.keyPoints.length > 0) {
    lines.push(`  ${chalk.dim('📌 Key Points:')}`);
    for (const kp of summary.keyPoints) {
      lines.push(`    ${chalk.blue('•')} ${kp}`);
    }
    lines.push('');
  }

  // Relevance score bar
  const barLen = Math.round((summary.relevanceScore / 100) * 20);
  const bar = '█'.repeat(Math.min(barLen, 20)).padEnd(20, '░');
  const scoreColor =
    summary.relevanceScore >= 60 ? chalk.green :
    summary.relevanceScore >= 30 ? chalk.yellow :
    chalk.red;
  lines.push(`  ${chalk.dim('📊 Score:')} ${scoreColor(bar)} ${chalk.bold(String(summary.relevanceScore))}`);

  // Link
  lines.push(`  ${chalk.dim('🔗')} ${chalk.underline.cyan(`https://arxiv.org/abs/${summary.id}`)}`);

  // Separator
  lines.push('');
  lines.push(chalk.gray('─'.repeat(60)));
  lines.push('');

  return lines.join('\n');
}

export function renderHeader(topic: string, count: number): string {
  return [
    '',
    chalk.bold.cyan('╔══════════════════════════════════════════════╗'),
    chalk.bold.cyan('║') + chalk.bold.whiteBright('        paper-digest — AI Paper Digest        ') + chalk.bold.cyan('║'),
    chalk.bold.cyan('╚══════════════════════════════════════════════╝'),
    '',
    chalk.whiteBright(` 📚 Top ${chalk.bold(String(count))} papers on`) + chalk.bold.yellow(` "${topic}"`),
    chalk.dim(` ${new Date().toISOString().slice(0, 10)} | Beta / B-Labs`),
    '',
  ].join('\n');
}

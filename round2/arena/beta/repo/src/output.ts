import chalk from "chalk";
import type { DigestEntry } from "./summary.js";

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 3) + "..." : s;
}

function escapeBorders(s: string): string {
  return s.replace(/\n/g, " ").replace(/\r/g, "");
}

function renderCard(d: DigestEntry): string {
  const width = 74;
  const lines: string[] = [];

  // Header row
  const catTag = chalk.cyan(d.category);
  const titleStr = truncate(escapeBorders(d.title), width - 8);
  const header = `${chalk.bold("🔬")} ${catTag} ${chalk.whiteBright(titleStr)}`;
  lines.push(`${chalk.blue("┌─")} ${header}`);

  // Author + date row
  const authorStr = d.authors.length > 40 ? d.authors.slice(0, 37) + "..." : d.authors;
  lines.push(`${chalk.blue("│")} ${chalk.dim("By")} ${chalk.yellow(authorStr)} ${chalk.dim(`(📅 ${d.published})`)}`);

  // Separator
  lines.push(`${chalk.blue("│")} ${chalk.gray("─".repeat(width - 2))}`);

  // Contribution
  const contribStr = truncate(escapeBorders(d.contribution), width - 4);
  lines.push(`${chalk.blue("│")} ${chalk.gray(contribStr)}`);

  // Tags (top 5 keywords from takeaways)
  const tags = d.takeaways.slice(0, 5);
  if (tags.length > 0) {
    const tagStr = tags.map((t) => chalk.yellow(truncate(escapeBorders(t), 30))).join("  ");
    lines.push(`${chalk.blue("│")} ${chalk.dim("🏷️")} ${tagStr}`);
  }

  // arXiv link
  lines.push(`${chalk.blue("│")} ${chalk.dim("📄")} ${chalk.underline(`arXiv:${d.id}`)}`);

  // Footer
  lines.push(`${chalk.blue("└─")} ${chalk.gray("─".repeat(width - 3))}`);

  return lines.join("\n");
}

export function printDigest(digest: DigestEntry): void {
  console.log(renderCard(digest));
}

export function printDigests(digests: DigestEntry[]): void {
  for (const d of digests) {
    console.log(renderCard(d));
    console.log("");
  }
  console.log(chalk.dim(`Total: ${digests.length} papers`));
}

export function exportMarkdown(digests: DigestEntry[]): string {
  const lines: string[] = ["# Paper Digest", "", `Generated: ${new Date().toISOString().slice(0, 10)}`, ""];

  for (const d of digests) {
    lines.push(`## ${d.title}`);
    lines.push(`**ID:** \`${d.id}\`  **Date:** ${d.published}  **Category:** ${d.category}`);
    lines.push(`**Authors:** ${d.authors}`);
    lines.push("");
    lines.push(`**Contribution:** ${d.contribution}`);
    lines.push(`**Methodology:** ${d.methodology}`);
    lines.push("");
    lines.push("**Key Takeaways:**");
    for (const t of d.takeaways) lines.push(`- ${t}`);
    lines.push("");
    lines.push(`[View on arXiv](https://arxiv.org/abs/${d.id})`);
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

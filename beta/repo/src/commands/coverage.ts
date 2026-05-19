import chalk from 'chalk';
import Table from 'cli-table3';
import { existsSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

interface CoverageFileData {
  lines: { pct: number };
  branches: { pct: number };
  functions: { pct: number };
  statements: { pct: number };
}

interface CoverageSummary {
  total: CoverageFileData;
  [filePath: string]: CoverageFileData | undefined;
}

interface CoverageThresholds {
  lines: number;
  branches: number;
  functions: number;
  statements: number;
}

const COVERAGE_PATH = './coverage/coverage-summary.json';

function pctColor(pct: number): string {
  if (pct >= 80) return chalk.green(`${pct.toFixed(1)}% 🟢`);
  if (pct >= 60) return chalk.yellow(`${pct.toFixed(1)}% 🟡`);
  return chalk.red(`${pct.toFixed(1)}% 🔴`);
}

function getCoverageConfig(): CoverageThresholds | null {
  const configPath = './vitest.config.ts';
  if (!existsSync(configPath)) return null;

  // Inline the known thresholds from vitest.config.ts
  // vitest's V8 coverage thresholds: statements 50, branches 40, functions 50, lines 50
  try {
    const raw = readFileSync(configPath, 'utf-8');
    const linesMatch = raw.match(/lines:\s*(\d+)/);
    const branchesMatch = raw.match(/branches:\s*(\d+)/);
    const functionsMatch = raw.match(/functions:\s*(\d+)/);
    const statementsMatch = raw.match(/statements:\s*(\d+)/);
    if (linesMatch && branchesMatch && functionsMatch && statementsMatch) {
      return {
        lines: parseInt(linesMatch[1], 10),
        branches: parseInt(branchesMatch[1], 10),
        functions: parseInt(functionsMatch[1], 10),
        statements: parseInt(statementsMatch[1], 10),
      };
    }
  } catch {
    // Silently fall back
  }
  return null;
}

export function renderCoverage(summary: CoverageSummary): void {
  console.log(chalk.bold('\n🧬  Test Coverage Report\n'));

  const total = summary.total;
  console.log(chalk.bold('📊  Overall Coverage:'));
  console.log(`  Lines:      ${pctColor(total.lines.pct)}`);
  console.log(`  Branches:   ${pctColor(total.branches.pct)}`);
  console.log(`  Functions:  ${pctColor(total.functions.pct)}`);
  console.log(`  Statements: ${pctColor(total.statements.pct)}`);

  const table = new Table({
    head: [
      chalk.bold('File'),
      chalk.bold('Lines'),
      chalk.bold('Branches'),
      chalk.bold('Functions'),
      chalk.bold('Statements'),
    ],
    style: { head: [], border: [] },
  });

  for (const [filePath, fileData] of Object.entries(summary)) {
    if (filePath === 'total' || !fileData) continue;
    if (!filePath.startsWith('src/')) continue;

    table.push([
      chalk.cyan(filePath.replace('src/', '')),
      pctColor(fileData.lines.pct),
      pctColor(fileData.branches.pct),
      pctColor(fileData.functions.pct),
      pctColor(fileData.statements.pct),
    ]);
  }

  console.log(table.toString());

  const config = getCoverageConfig();
  if (config) {
    const warnings: string[] = [];
    if (total.lines.pct < config.lines) warnings.push(`Lines: ${total.lines.pct}% < ${config.lines}%`);
    if (total.branches.pct < config.branches) warnings.push(`Branches: ${total.branches.pct}% < ${config.branches}%`);
    if (total.functions.pct < config.functions) warnings.push(`Functions: ${total.functions.pct}% < ${config.functions}%`);
    if (total.statements.pct < config.statements) warnings.push(`Statements: ${total.statements.pct}% < ${config.statements}%`);

    if (warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️  Threshold Warnings:'));
      warnings.forEach(w => console.log(chalk.yellow(`  ${w}`)));
    } else {
      console.log(chalk.green('\n✅  All coverage thresholds met!'));
    }
  }
}

export async function coverageCommand(options: { run?: boolean } = {}): Promise<void> {
  if (options.run !== false) {
    console.log(chalk.dim('⏳ Running tests with coverage...'));
    try {
      execSync('npx vitest run --coverage', {
        stdio: 'pipe',
        encoding: 'utf-8',
      });
    } catch {
      // vitest coverage still produces output even when tests fail
    }
  }

  if (!existsSync(COVERAGE_PATH)) {
    console.error(chalk.red('✗ Coverage summary not found. Run `npm run coverage` first.'));
    process.exit(1);
  }

  const raw = readFileSync(COVERAGE_PATH, 'utf-8');
  const summary: CoverageSummary = JSON.parse(raw);
  renderCoverage(summary);
}

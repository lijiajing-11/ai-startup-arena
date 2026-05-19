import chalk from 'chalk';
import Table from 'cli-table3';
import type { RepoData, RepoSnapshot, BattleResult, JsonSnapshot, SingleJsonSnapshot } from '../models.js';
import { formatNumber, getRepo, clearCache, getRepos } from '../github.js';

// ── Shared poll-loop utility ─────────────────────────────────────────────

type PollTick = () => Promise<void>;

/**
 * Creates and runs a polling loop with AbortSignal support.
 * Handles the first tick, setInterval setup, abort cleanup, and summary.
 * Returns a promise that resolves when the loop ends.
 */
async function createPollLoop(
  tick: PollTick,
  intervalSec: number,
  signal: AbortSignal | undefined,
  onEnd: () => void
): Promise<void> {
  await tick();
  if (signal?.aborted) return;

  return new Promise<void>((resolve) => {
    const cleanup = () => {
      clearInterval(timer);
      onEnd();
      resolve();
    };

    if (signal) {
      signal.addEventListener('abort', cleanup, { once: true });
    }

    const timer = setInterval(async () => {
      if (signal?.aborted) {
        clearInterval(timer);
        signal.removeEventListener('abort', cleanup);
        onEnd();
        resolve();
        return;
      }
      await tick();
    }, intervalSec * 1000);
  });
}

function formatElapsed(startTime: number): string {
  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  return `${mins}m ${secs}s`;
}

function onAbortSummary(
  startTime: number,
  totalGrowth: number,
  extra?: string
): void {
  const elapsed = formatElapsed(startTime);
  const growth =
    totalGrowth > 0 ? `+${totalGrowth} new stars` : `${totalGrowth} new stars`;
  const suffix = extra ? ` (${extra})` : '';
  console.log(chalk.cyan(`\n📊 Watch summary: ${elapsed} watched, ${growth}${suffix}`));
}

export async function watchRepo(
  repoStr: string,
  onUpdate: (snapshot: RepoSnapshot, previous?: RepoSnapshot) => void,
  interval: number = 30,
  signal?: AbortSignal
): Promise<void> {
  let previous: RepoSnapshot | undefined;
  let totalGrowth = 0;
  const startTime = Date.now();

  const tick = async (): Promise<void> => {
    if (signal?.aborted) return;
    try {
      clearCache();
      const repo = await getRepo(repoStr);
      const snapshot: RepoSnapshot = { repo, timestamp: new Date() };

      if (previous) {
        const growth = repo.stars - previous.repo.stars;
        totalGrowth += growth;
      }
      onUpdate(snapshot, previous);
      previous = snapshot;
    } catch (err: any) {
      if (previous) {
        console.log(chalk.yellow(`⚠ Stale data (last: ${previous.timestamp.toLocaleTimeString()}) — ${err.message}`));
      } else {
        console.error(chalk.red(`✗ Error: ${err.message}`));
        return;
      }
    }
  };

  await createPollLoop(tick, interval, signal, () => onAbortSummary(startTime, totalGrowth));
}

/**
 * Single-repo watch with JSON output mode.
 * Prints JSON to stdout, no summary on abort.
 * Only the `lastUpdated` key changes between ticks — each line is valid NDJSON.
 */
export async function watchSingleRepoJson(
  repoStr: string,
  interval: number = 30,
  signal?: AbortSignal
): Promise<void> {
  const startTime = Date.now();

  const tick = async (): Promise<void> => {
    if (signal?.aborted) return;
    try {
      clearCache();
      const repo = await getRepo(repoStr);
      const snapshot: SingleJsonSnapshot = {
        timestamp: new Date().toISOString(),
        repo,
      };
      console.log(JSON.stringify(snapshot));
    } catch (err: any) {
      console.error(JSON.stringify({ error: err.message }));
    }
  };

  await createPollLoop(tick, interval, signal, () => onAbortSummary(startTime, 0, 'JSON mode'));
}

export function renderDashboard(snapshot: RepoSnapshot, previous?: RepoSnapshot): void {
  const { repo } = snapshot;
  const table = new Table({
    style: { head: ['cyan'], border: ['gray'] },
    colWidths: [20, 30],
  });

  const starDelta = previous ? repo.stars - previous.repo.stars : 0;
  const forkDelta = previous ? repo.forks - previous.repo.forks : 0;
  const issueDelta = previous ? repo.openIssues - previous.repo.openIssues : 0;

  table.push(
    [chalk.bold('Repository'), chalk.cyan(repo.fullName)],
    [chalk.bold('Description'), repo.description ?? chalk.gray('No description')],
    [
      chalk.bold('⭐ Stars'),
      `${formatNumber(repo.stars)} ${starDelta !== 0 ? (starDelta > 0 ? chalk.green(`(+${starDelta})`) : chalk.red(`(${starDelta})`)) : ''}`,
    ],
    [
      chalk.bold('⑂ Forks'),
      `${formatNumber(repo.forks)} ${forkDelta !== 0 ? (forkDelta > 0 ? chalk.green(`(+${forkDelta})`) : chalk.red(`(${forkDelta})`)) : ''}`,
    ],
    [
      chalk.bold('⚠ Issues'),
      `${formatNumber(repo.openIssues)} ${issueDelta !== 0 ? (issueDelta > 0 ? chalk.red(`(+${issueDelta})`) : chalk.green(`(${issueDelta})`)) : ''}`,
    ],
    [chalk.bold('🔤 Language'), repo.language ?? chalk.gray('N/A')],
    [chalk.bold('📜 License'), repo.license ?? chalk.gray('None')],
    [chalk.bold('🕐 Updated'), new Date(repo.updatedAt).toLocaleString()],
    [chalk.bold('📅 Created'), new Date(repo.createdAt).toLocaleDateString()],
  );

  console.clear();
  console.log(chalk.bold.cyan('\n  ┌──────────────────────────────────────┐'));
  console.log(chalk.bold.cyan('  │        🧬  repo-sense  WATCH        │'));
  console.log(chalk.bold.cyan('  └──────────────────────────────────────┘\n'));
  console.log(table.toString());
  console.log(chalk.gray(`  Last updated: ${snapshot.timestamp.toLocaleTimeString()}  |  Press Ctrl+C to stop\n`));
}

export async function battleRepos(repo1: string, repo2: string): Promise<BattleResult> {
  const [r1, r2] = await Promise.all([getRepo(repo1), getRepo(repo2)]);

  const starDiff = r1.stars - r2.stars;
  const forkDiff = r1.forks - r2.forks;
  const issueDiff = r1.openIssues - r2.openIssues;

  let winner: 'repo1' | 'repo2' | 'tie';
  if (starDiff > 0) winner = 'repo1';
  else if (starDiff < 0) winner = 'repo2';
  else winner = 'tie';

  const scores: Record<string, string> = {
    stars: starDiff > 0 ? r1.fullName : starDiff < 0 ? r2.fullName : 'Tie',
    forks: forkDiff > 0 ? r1.fullName : forkDiff < 0 ? r2.fullName : 'Tie',
    issues: issueDiff < 0 ? r1.fullName : issueDiff > 0 ? r2.fullName : 'Tie', // fewer issues = better
    language: r1.language === r2.language ? 'Same' : `${r1.language ?? 'N/A'} vs ${r2.language ?? 'N/A'}`,
  };

  return {
    repo1: { repo: r1, timestamp: new Date() },
    repo2: { repo: r2, timestamp: new Date() },
    winner,
    starDiff,
    forkDiff,
    issueDiff,
    scores,
  };
}

export function renderBattle(result: BattleResult): void {
  const { repo1: s1, repo2: s2, winner, starDiff, forkDiff, issueDiff, scores } = result;
  const r1 = s1.repo;
  const r2 = s2.repo;

  const table = new Table({
    style: { head: ['cyan'], border: ['gray'] },
    head: ['Metric', chalk.cyan(r1.fullName), chalk.magenta(r2.fullName), 'Victor'],
    colWidths: [14, 22, 22, 22],
  });

  const starWinner = starDiff > 0 ? r1.fullName : starDiff < 0 ? r2.fullName : '—';
  const forkWinner = forkDiff > 0 ? r1.fullName : forkDiff < 0 ? r2.fullName : '—';
  const issueWinner = issueDiff < 0 ? r1.fullName : issueDiff > 0 ? r2.fullName : '—';

  table.push(
    [
      '⭐ Stars',
      chalk.yellow(formatNumber(r1.stars)),
      chalk.yellow(formatNumber(r2.stars)),
      chalk.green(starWinner === r1.fullName ? '🏆' : starWinner === r2.fullName ? '🏆' : '—'),
    ],
    [
      '⑂ Forks',
      chalk.blue(formatNumber(r1.forks)),
      chalk.blue(formatNumber(r2.forks)),
      chalk.green(forkWinner === r1.fullName ? '🏆' : forkWinner === r2.fullName ? '🏆' : '—'),
    ],
    [
      '⚠ Issues',
      chalk.red(formatNumber(r1.openIssues)),
      chalk.red(formatNumber(r2.openIssues)),
      chalk.green(issueWinner === r1.fullName ? '🏆 (fewer)' : issueWinner === r2.fullName ? '🏆 (fewer)' : '—'),
    ],
    [
      '🔤 Language',
      r1.language ?? '—',
      r2.language ?? '—',
      r1.language === r2.language ? '✓ Same' : chalk.gray('Different'),
    ],
    [
      '📜 License',
      r1.license ?? '—',
      r2.license ?? '—',
      r1.license === r2.license ? '✓ Same' : chalk.gray('Different'),
    ],
  );

  console.log(chalk.bold.cyan('\n  ╔══════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('  ║            ⚔️   REPO BATTLE  ⚔️                        ║'));
  console.log(chalk.bold.cyan('  ╚══════════════════════════════════════════════════════════╝\n'));
  console.log(table.toString());

  console.log();

  // Winner summary
  if (winner === 'tie') {
    console.log(chalk.bold.yellow('\n  🤝 It\'s a tie! Both repos have the same star count!\n'));
  } else {
    const w = winner === 'repo1' ? r1 : r2;
    const l = winner === 'repo1' ? r2 : r1;
    const diff = Math.abs(starDiff);
    console.log(chalk.bold(`\n  🏆 ${chalk.green(w.fullName)} WINS!`));
    console.log(chalk.white(`     Leads by ${chalk.yellow(formatNumber(diff))} stars over ${chalk.gray(l.fullName)}`));
    if (forkDiff > 0 && winner === 'repo1') {
      console.log(chalk.gray(`     Also leads in forks: ${formatNumber(forkDiff)} more`));
    } else if (forkDiff > 0) {
      console.log(chalk.gray(`     ${l.fullName} leads in forks: ${formatNumber(Math.abs(forkDiff))} more`));
    }
    console.log();
  }
}

// ── Multi-repo battle (3+) ─────────────────────────────────────────────

/**
 * Battle multiple repos (3+).
 * Falls back to existing battleRepos when called with exactly 2 repos.
 */
export async function battleMultiRepos(repoStrs: string[]): Promise<{ repos: RepoSnapshot[]; winner: string }> {
  if (repoStrs.length < 2) throw new Error('Need at least 2 repos');
  if (repoStrs.length === 2) {
    const result = await battleRepos(repoStrs[0], repoStrs[1]);
    return {
      repos: [result.repo1, result.repo2],
      winner: result.winner === 'tie' ? 'Tie' : result.repo1.repo.fullName,
    };
  }

  const repoData = await getRepos(repoStrs);
  const snapshots = repoData.map((r) => ({ repo: r, timestamp: new Date() }));

  // Sort: most stars wins, tie-breaker: forks
  const sorted = [...repoData].sort((a, b) => b.stars - a.stars || b.forks - a.forks);
  const winner = sorted[0].fullName;

  return { repos: snapshots, winner };
}

/**
 * Render the N-way battle comparison table.
 * Column width adjusts dynamically based on repo count.
 */
export function renderBattleMulti(results: RepoData[], winnerName: string): void {
  const colCount = results.length;

  if (colCount > 5) {
    console.log(chalk.yellow(`⚠ Warning: ${colCount} repos may not fit well in terminal width.`));
  }

  const colWidth = Math.min(22, Math.floor(68 / colCount));
  const totalWidth = 14 + colCount * colWidth + colCount;

  const head = ['Metric', ...results.map((r) => chalk.cyan(r.fullName))];
  const widths = [14, ...Array(colCount).fill(colWidth)];

  const table = new Table({
    style: { head: ['cyan'], border: ['gray'] },
    head,
    colWidths: widths,
  });

  // Stars row — mark winner
  const maxStars = Math.max(...results.map((r) => r.stars));
  const starRow = [
    '⭐ Stars',
    ...results.map((r) => {
      const val = chalk.yellow(formatNumber(r.stars));
      return r.stars === maxStars ? `${val} 🏆` : val;
    }),
  ];

  // Forks row — mark winner
  const maxForks = Math.max(...results.map((r) => r.forks));
  const forkRow = [
    '⑂ Forks',
    ...results.map((r) => {
      const val = chalk.blue(formatNumber(r.forks));
      return r.forks === maxForks ? `${val} 🏆` : val;
    }),
  ];

  // Issues row — mark fewest issues as winner
  const minIssues = Math.min(...results.map((r) => r.openIssues));
  const issueRow = [
    '⚠ Issues',
    ...results.map((r) => {
      const val = chalk.red(formatNumber(r.openIssues));
      return r.openIssues === minIssues ? `${val} 🏆` : val;
    }),
  ];

  const langRow = ['🔤 Lang', ...results.map((r) => r.language ?? chalk.gray('—'))];
  const licRow = ['📜 Lic', ...results.map((r) => r.license ?? chalk.gray('—'))];

  // Age row
  const now = Date.now();
  const ageRow = [
    '📅 Age',
    ...results.map((r) => {
      const ageMs = now - new Date(r.createdAt).getTime();
      const years = ageMs / (1000 * 60 * 60 * 24 * 365.25);
      return `${years.toFixed(1)} yrs`;
    }),
  ];

  table.push(starRow, forkRow, issueRow, langRow, licRow, ageRow);

  console.log(chalk.bold.cyan('\n  ╔══════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('  ║            ⚔️   MULTI REPO BATTLE  ⚔️                  ║'));
  console.log(chalk.bold.cyan('  ╚══════════════════════════════════════════════════════════╝\n'));
  console.log(table.toString());
  console.log(chalk.bold(`\n  🏆 Overall Winner: ${chalk.green(winnerName)}\n`));
}

/**
 * Watch multiple repos simultaneously with a compact dashboard.
 */
export async function watchMultiRepos(
  repoStrs: string[],
  interval: number,
  useJson: boolean,
  signal?: AbortSignal
): Promise<void> {
  let previousData: RepoData[] = [];
  let startTime = Date.now();

  const tick = async (): Promise<void> => {
    if (signal?.aborted) return;
    try {
      clearCache();
      const repos = await getRepos(repoStrs);

      if (useJson) {
        const snapshot: JsonSnapshot = {
          timestamp: new Date().toISOString(),
          repos,
        };
        console.log(JSON.stringify(snapshot, null, 2));
      } else {
        renderMultiDashboard(repoStrs, repos, previousData);
      }

      previousData = repos;
    } catch (err: any) {
      console.error(chalk.red(`✗ Error: ${err.message}`));
    }
  };

  await tick();
  if (signal?.aborted) return;

  return new Promise((resolve) => {
    const onAbort = () => {
      clearInterval(timer);
      onAbortSummary(startTime, 0, `${repoStrs.length} repos`);
      resolve();
    };

    if (signal) {
      signal.addEventListener('abort', onAbort, { once: true });
    }

    const timer = setInterval(async () => {
      if (signal?.aborted) {
        clearInterval(timer);
        if (signal) signal.removeEventListener('abort', onAbort);
        onAbortSummary(startTime, 0, `${repoStrs.length} repos`);
        resolve();
        return;
      }
      await tick();
    }, interval * 1000);
  });
}

/** Compact multi-repo dashboard table */
function renderMultiDashboard(repoStrs: string[], repos: RepoData[], previous?: RepoData[]): void {
  const table = new Table({
    style: { head: ['cyan'], border: ['gray'] },
    head: ['Repository', '⭐ Stars', '⑂ Forks', '⚠ Issues', '🔤 Lang', '📜 License'],
    colWidths: [26, 14, 14, 14, 14, 14],
  });

  for (let i = 0; i < repos.length; i++) {
    const r = repos[i];
    const prev = previous?.[i];

    const starStr = prev
      ? `${formatNumber(r.stars)} ${r.stars > prev.stars ? chalk.green('+' + (r.stars - prev.stars)) : r.stars < prev.stars ? chalk.red('' + (r.stars - prev.stars)) : ''}`
      : formatNumber(r.stars);

    const forkStr = prev
      ? `${formatNumber(r.forks)} ${r.forks > prev.forks ? chalk.green('+' + (r.forks - prev.forks)) : r.forks < prev.forks ? chalk.red('' + (r.forks - prev.forks)) : ''}`
      : formatNumber(r.forks);

    const issueStr = prev
      ? `${formatNumber(r.openIssues)} ${r.openIssues > prev.openIssues ? chalk.red('+' + (r.openIssues - prev.openIssues)) : r.openIssues < prev.openIssues ? chalk.green('' + (r.openIssues - prev.openIssues)) : ''}`
      : formatNumber(r.openIssues);

    table.push([
      chalk.cyan(r.fullName),
      chalk.yellow(starStr),
      chalk.blue(forkStr),
      chalk.red(issueStr),
      r.language ?? chalk.gray('—'),
      r.license ?? chalk.gray('—'),
    ]);
  }

  console.clear();
  console.log(chalk.bold.cyan('\n  ┌────────────────────────────────────────────────────────────────┐'));
  console.log(chalk.bold.cyan('  │           📡  repo-sense  MULTI-WATCH  📡                   │'));
  console.log(chalk.bold.cyan('  └────────────────────────────────────────────────────────────────┘\n'));
  console.log(table.toString());
  console.log(chalk.gray(`  Watching ${repos.length} repos  ·  ${new Date().toLocaleTimeString()}  ·  Ctrl+C to stop\n`));
}

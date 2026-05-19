import chalk from 'chalk';
import Table from 'cli-table3';
import type { RepoData, RepoSnapshot, BattleResult, JsonSnapshot } from '../models.js';
import { formatNumber, getRepo, clearCache, getRepos } from '../github.js';
     5|
     6|export async function watchRepo(
     7|  repoStr: string,
     8|  onUpdate: (snapshot: RepoSnapshot, previous?: RepoSnapshot) => void,
     9|  interval: number = 30,
    10|  signal?: AbortSignal
    11|): Promise<void> {
    12|  let previous: RepoSnapshot | undefined;
    13|  let totalGrowth = 0;
    14|  let startTime = Date.now();
    15|
    16|  const tick = async (): Promise<void> => {
    17|    if (signal?.aborted) return;
    18|    try {
    19|      clearCache();
    20|      const repo = await getRepo(repoStr);
    21|      const snapshot: RepoSnapshot = { repo, timestamp: new Date() };
    22|
    23|      if (previous) {
    24|        const growth = repo.stars - previous.repo.stars;
    25|        totalGrowth += growth;
    26|      }
    27|      onUpdate(snapshot, previous);
    28|      previous = snapshot;
    29|    } catch (err: any) {
    30|      if (previous) {
    31|        console.log(chalk.yellow(`⚠ Stale data (last: ${previous.timestamp.toLocaleTimeString()}) — ${err.message}`));
    32|      } else {
    33|        console.error(chalk.red(`✗ Error: ${err.message}`));
    34|        return;
    35|      }
    36|    }
    37|  };
    38|
    39|  await tick();
    40|  if (signal?.aborted) return;
    41|
    42|  return new Promise((resolve) => {
    43|    const timer = setInterval(async () => {
    44|      if (signal?.aborted) {
    45|        clearInterval(timer);
    46|        const elapsed = Math.round((Date.now() - startTime) / 1000);
    47|        const mins = Math.floor(elapsed / 60);
    48|        const secs = elapsed % 60;
    49|        console.log(chalk.cyan(`\n📊 Watch summary: ${mins}m ${secs}s watched, ${totalGrowth > 0 ? '+' : ''}${totalGrowth} new stars`));
    50|        resolve();
    51|        return;
    52|      }
    53|      await tick();
    54|    }, interval * 1000);
    55|  });
    56|}
    57|
    58|export function renderDashboard(snapshot: RepoSnapshot, previous?: RepoSnapshot): void {
    59|  const { repo } = snapshot;
    60|  const table = new Table({
    61|    style: { head: ['cyan'], border: ['gray'] },
    62|    colWidths: [20, 30],
    63|  });
    64|
    65|  const starDelta = previous ? repo.stars - previous.repo.stars : 0;
    66|  const forkDelta = previous ? repo.forks - previous.repo.forks : 0;
    67|  const issueDelta = previous ? repo.openIssues - previous.repo.openIssues : 0;
    68|
    69|  table.push(
    70|    [chalk.bold('Repository'), chalk.cyan(repo.fullName)],
    71|    [chalk.bold('Description'), repo.description ?? chalk.gray('No description')],
    72|    [
    73|      chalk.bold('⭐ Stars'),
    74|      `${formatNumber(repo.stars)} ${starDelta !== 0 ? (starDelta > 0 ? chalk.green(`(+${starDelta})`) : chalk.red(`(${starDelta})`)) : ''}`,
    75|    ],
    76|    [
    77|      chalk.bold('⑂ Forks'),
    78|      `${formatNumber(repo.forks)} ${forkDelta !== 0 ? (forkDelta > 0 ? chalk.green(`(+${forkDelta})`) : chalk.red(`(${forkDelta})`)) : ''}`,
    79|    ],
    80|    [
    81|      chalk.bold('⚠ Issues'),
    82|      `${formatNumber(repo.openIssues)} ${issueDelta !== 0 ? (issueDelta > 0 ? chalk.red(`(+${issueDelta})`) : chalk.green(`(${issueDelta})`)) : ''}`,
    83|    ],
    84|    [chalk.bold('🔤 Language'), repo.language ?? chalk.gray('N/A')],
    85|    [chalk.bold('📜 License'), repo.license ?? chalk.gray('None')],
    86|    [chalk.bold('🕐 Updated'), new Date(repo.updatedAt).toLocaleString()],
    87|    [chalk.bold('📅 Created'), new Date(repo.createdAt).toLocaleDateString()],
    88|  );
    89|
    90|  console.clear();
    91|  console.log(chalk.bold.cyan('\n  ┌──────────────────────────────────────┐'));
    92|  console.log(chalk.bold.cyan('  │        🧬  repo-sense  WATCH        │'));
    93|  console.log(chalk.bold.cyan('  └──────────────────────────────────────┘\n'));
    94|  console.log(table.toString());
    95|  console.log(chalk.gray(`  Last updated: ${snapshot.timestamp.toLocaleTimeString()}  |  Press Ctrl+C to stop\n`));
    96|}
    97|
    98|export async function battleRepos(repo1: string, repo2: string): Promise<BattleResult> {
    99|  const [r1, r2] = await Promise.all([getRepo(repo1), getRepo(repo2)]);
   100|
   101|  const starDiff = r1.stars - r2.stars;
   102|  const forkDiff = r1.forks - r2.forks;
   103|  const issueDiff = r1.openIssues - r2.openIssues;
   104|
   105|  let winner: 'repo1' | 'repo2' | 'tie';
   106|  if (starDiff > 0) winner = 'repo1';
   107|  else if (starDiff < 0) winner = 'repo2';
   108|  else winner = 'tie';
   109|
   110|  const scores: Record<string, string> = {
   111|    stars: starDiff > 0 ? r1.fullName : starDiff < 0 ? r2.fullName : 'Tie',
   112|    forks: forkDiff > 0 ? r1.fullName : forkDiff < 0 ? r2.fullName : 'Tie',
   113|    issues: issueDiff < 0 ? r1.fullName : issueDiff > 0 ? r2.fullName : 'Tie', // fewer issues = better
   114|    language: r1.language === r2.language ? 'Same' : `${r1.language ?? 'N/A'} vs ${r2.language ?? 'N/A'}`,
   115|  };
   116|
   117|  return {
   118|    repo1: { repo: r1, timestamp: new Date() },
   119|    repo2: { repo: r2, timestamp: new Date() },
   120|    winner,
   121|    starDiff,
   122|    forkDiff,
   123|    issueDiff,
   124|    scores,
   125|  };
   126|}
   127|
   128|export function renderBattle(result: BattleResult): void {
   129|  const { repo1: s1, repo2: s2, winner, starDiff, forkDiff, issueDiff, scores } = result;
   130|  const r1 = s1.repo;
   131|  const r2 = s2.repo;
   132|
   133|  const table = new Table({
   134|    style: { head: ['cyan'], border: ['gray'] },
   135|    head: ['Metric', chalk.cyan(r1.fullName), chalk.magenta(r2.fullName), 'Victor'],
   136|    colWidths: [14, 22, 22, 22],
   137|  });
   138|
   139|  const starWinner = starDiff > 0 ? r1.fullName : starDiff < 0 ? r2.fullName : '—';
   140|  const forkWinner = forkDiff > 0 ? r1.fullName : forkDiff < 0 ? r2.fullName : '—';
   141|  const issueWinner = issueDiff < 0 ? r1.fullName : issueDiff > 0 ? r2.fullName : '—';
   142|
   143|  table.push(
   144|    [
   145|      '⭐ Stars',
   146|      chalk.yellow(formatNumber(r1.stars)),
   147|      chalk.yellow(formatNumber(r2.stars)),
   148|      chalk.green(starWinner === r1.fullName ? '🏆' : starWinner === r2.fullName ? '🏆' : '—'),
   149|    ],
   150|    [
   151|      '⑂ Forks',
   152|      chalk.blue(formatNumber(r1.forks)),
   153|      chalk.blue(formatNumber(r2.forks)),
   154|      chalk.green(forkWinner === r1.fullName ? '🏆' : forkWinner === r2.fullName ? '🏆' : '—'),
   155|    ],
   156|    [
   157|      '⚠ Issues',
   158|      chalk.red(formatNumber(r1.openIssues)),
   159|      chalk.red(formatNumber(r2.openIssues)),
   160|      chalk.green(issueWinner === r1.fullName ? '🏆 (fewer)' : issueWinner === r2.fullName ? '🏆 (fewer)' : '—'),
   161|    ],
   162|    [
   163|      '🔤 Language',
   164|      r1.language ?? '—',
   165|      r2.language ?? '—',
   166|      r1.language === r2.language ? '✓ Same' : chalk.gray('Different'),
   167|    ],
   168|    [
   169|      '📜 License',
   170|      r1.license ?? '—',
   171|      r2.license ?? '—',
   172|      r1.license === r2.license ? '✓ Same' : chalk.gray('Different'),
   173|    ],
   174|  );
   175|
   176|  console.log(chalk.bold.cyan('\n  ╔══════════════════════════════════════════════════════════╗'));
   177|  console.log(chalk.bold.cyan('  ║            ⚔️   REPO BATTLE  ⚔️                        ║'));
   178|  console.log(chalk.bold.cyan('  ╚══════════════════════════════════════════════════════════╝\n'));
   179|  console.log(table.toString());
   180|
   181|  console.log();
   182|
   183|  // Winner summary
   184|  if (winner === 'tie') {
   185|    console.log(chalk.bold.yellow('\n  🤝 It\'s a tie! Both repos have the same star count!\n'));
   186|  } else {
   187|    const w = winner === 'repo1' ? r1 : r2;
   188|    const l = winner === 'repo1' ? r2 : r1;
   189|    const diff = Math.abs(starDiff);
   190|    console.log(chalk.bold(`\n  🏆 ${chalk.green(w.fullName)} WINS!`));
   191|    console.log(chalk.white(`     Leads by ${chalk.yellow(formatNumber(diff))} stars over ${chalk.gray(l.fullName)}`));
   192|    if (forkDiff > 0 && winner === 'repo1') {
   193|      console.log(chalk.gray(`     Also leads in forks: ${formatNumber(forkDiff)} more`));
   194|    } else if (forkDiff > 0) {
   195|      console.log(chalk.gray(`     ${l.fullName} leads in forks: ${formatNumber(Math.abs(forkDiff))} more`));
   196|    }
   197|    console.log();
   198|  }
   199|}
   200|
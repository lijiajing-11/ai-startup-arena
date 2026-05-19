import { Command } from 'commander';
import { watchRepo, watchSingleRepoJson, renderDashboard, battleRepos, renderBattle, battleMultiRepos, renderBattleMulti, watchMultiRepos } from './commands/watch.js';
import { starsCommand } from './commands/stars.js';
import { insightCommand } from './commands/insight.js';
import { historyCommand } from './commands/history.js';

export async function run(): Promise<void> {
  const program = new Command();

  program
    .name('rs')
    .description('🧬 repo-sense — Beautiful GitHub repo intelligence from your terminal')
    .version('0.2.1');

  program
    .command('watch <repo>')
    .description('Watch a repository with live-updating metrics dashboard')
    .option('-i, --interval <seconds>', 'Polling interval in seconds', '30')
    .option('-j, --json', 'Output JSON instead of dashboard', false)
    .action(async (repo: string, options: { interval: string; json: boolean }) => {
      const interval = parseInt(options.interval, 10) || 30;
      const abortController = new AbortController();

      process.on('SIGINT', () => {
        abortController.abort();
      });

      try {
        if (options.json) {
          await watchSingleRepoJson(repo, interval, abortController.signal);
        } else {
          await watchRepo(
            repo,
            (snapshot, previous) => renderDashboard(snapshot, previous),
            interval,
            abortController.signal
          );
        }
      } catch (err: any) {
        console.error(`✗ Error: ${err.message}`);
        process.exit(1);
      }
    });

  program
    .command('battle <repos...>')
    .description('Compare repositories head-to-head (2+ repos)')
    .action(async (repos: string[]) => {
      try {
        if (repos.length === 2) {
          const result = await battleRepos(repos[0], repos[1]);
          renderBattle(result);
        } else {
          const result = await battleMultiRepos(repos);
          renderBattleMulti(result.repos.map((s) => s.repo), result.winner);
        }
      } catch (err: any) {
        console.error(`✗ Error: ${err.message}`);
        process.exit(1);
      }
    });

  program
    .command('watch-multi <repos...>')
    .description('Watch multiple repositories simultaneously')
    .option('-i, --interval <seconds>', 'Polling interval in seconds', '30')
    .option('-j, --json', 'Output JSON instead of dashboard', false)
    .action(async (repos: string[], options: { interval: string; json: boolean }) => {
      const interval = parseInt(options.interval, 10) || 30;
      const abortController = new AbortController();

      process.on('SIGINT', () => {
        abortController.abort();
      });

      try {
        await watchMultiRepos(repos, interval, options.json, abortController.signal);
      } catch (err: any) {
        console.error(`✗ Error: ${err.message}`);
        process.exit(1);
      }
    });

  // stars 命令
  program
    .command('stars <repo>')
    .description('Quickly check stars and basic info for a repository')
    .action(async (repo: string) => {
      try {
        await starsCommand(repo);
      } catch (err: any) {
        console.error(`✗ Error: ${err.message}`);
        process.exit(1);
      }
    });

  // insight 命令
  program
    .command('insight <repo>')
    .description('Deep repository insight — star velocity, topics, age, and more')
    .action(async (repo: string) => {
      try {
        await insightCommand(repo);
      } catch (err: any) {
        console.error(`✗ Error: ${err.message}`);
        process.exit(1);
      }
    });

  // history 命令
  program
    .command('history <repo>')
    .description('Star history trend — velocity, milestones, growth phases')
    .action(async (repo: string) => {
      try {
        await historyCommand(repo);
      } catch (err: any) {
        console.error(`✗ Error: ${err.message}`);
        process.exit(1);
      }
    });

  await program.parseAsync(process.argv);
}

// VITEST 守卫：避免测试 import 时自动执行
if (typeof process !== 'undefined' && !process.env.VITEST) {
  run();
}

export default run;

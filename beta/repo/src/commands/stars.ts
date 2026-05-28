import chalk from 'chalk';
import { getRepo, getRepos, formatNumber } from '../github.js';
import type { StarsMultiResult } from '../models.js';

interface StarsOptions {
  json?: boolean;
}

export async function starsCommand(
  repoStr: string,
  options?: StarsOptions,
): Promise<void> {
  if (options?.json) {
    await starsJsonSingle(repoStr);
    return;
  }
  await starsRenderSingle(repoStr);
}

export async function starsMultiCommand(
  repoStrs: string[],
  options?: StarsOptions,
): Promise<void> {
  if (options?.json) {
    await starsJsonMulti(repoStrs);
    return;
  }
  await starsRenderMulti(repoStrs);
}

async function starsRenderSingle(repoStr: string): Promise<void> {
  const repo = await getRepo(repoStr);
  const starStr = formatNumber(repo.stars);
  const forkStr = formatNumber(repo.forks);
  const issueStr = formatNumber(repo.openIssues);

  console.log(`${chalk.yellow('⭐')} ${chalk.bold(repo.fullName)}`);
  console.log(`${chalk.yellow('★')} Stars:   ${chalk.bold(starStr)}`);
  console.log(`${chalk.cyan('⑂')} Forks:   ${forkStr}`);
  console.log(`${chalk.red('!')} Issues:  ${issueStr}`);
  console.log(`${chalk.gray('⎆')} Language: ${repo.language || chalk.dim('N/A')}`);
  console.log(`${chalk.gray('©')} License:  ${repo.license || chalk.dim('None')}`);
}

async function starsJsonSingle(repoStr: string): Promise<void> {
  const repo = await getRepo(repoStr);
  const output: StarsMultiResult = {
    command: 'stars',
    repos: [
      {
        repo: repo.fullName,
        stars: repo.stars,
        forks: repo.forks,
        openIssues: repo.openIssues,
        language: repo.language,
        license: repo.license,
      },
    ],
  };
  console.log(JSON.stringify(output, null, 2));
}

async function starsJsonMulti(repoStrs: string[]): Promise<void> {
  const repos = await getRepos(repoStrs);
  const output: StarsMultiResult = {
    command: 'stars',
    repos: repos.map((r) => ({
      repo: r.fullName,
      stars: r.stars,
      forks: r.forks,
      openIssues: r.openIssues,
      language: r.language,
      license: r.license,
    })),
  };
  console.log(JSON.stringify(output, null, 2));
}

async function starsRenderMulti(repoStrs: string[]): Promise<void> {
  const repos = await getRepos(repoStrs);

  for (const repo of repos) {
    const starStr = formatNumber(repo.stars);
    const forkStr = formatNumber(repo.forks);
    const issueStr = formatNumber(repo.openIssues);

    console.log(`${chalk.yellow('⭐')} ${chalk.bold(repo.fullName)}`);
    console.log(`  ${chalk.yellow('★')} Stars:   ${chalk.bold(starStr)}`);
    console.log(`  ${chalk.cyan('⑂')} Forks:   ${forkStr}`);
    console.log(`  ${chalk.red('!')} Issues:  ${issueStr}`);
    console.log(`  ${chalk.gray('⎆')} Language: ${repo.language || chalk.dim('N/A')}`);
    console.log(`  ${chalk.gray('©')} License:  ${repo.license || chalk.dim('None')}`);
    console.log();
  }
}

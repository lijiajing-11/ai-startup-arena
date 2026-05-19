import chalk from 'chalk';
import { getRepo, formatNumber } from '../github.js';

export async function starsCommand(repoStr: string): Promise<void> {
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

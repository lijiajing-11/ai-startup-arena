import { vi } from 'vitest';

const identity = (s: string) => s;

// Support chalk.cyan, chalk.bold.cyan, chalk.bold.cyan.underline — any chain
const handler: ProxyHandler<typeof identity> = {
  get: (target, prop) => {
    if (prop === 'then' || prop === 'catch') return undefined; // not a Promise
    if (typeof prop === 'string' && prop in target) return (target as any)[prop];
    // For any chained property, return identity
    return identity;
  },
  apply: (target, thisArg, args) => {
    if (typeof args[0] === 'string') return args[0];
    return '';
  },
};

const chalk = new Proxy(identity, handler);
(chalk as any).default = chalk;

export default chalk;

/**
 * Call this in a test file's vi.mock('chalk', ...) callback to get
 * the full chainable chalk mock. Usage:
 *
 *   vi.mock('chalk', () => createChalkMock());
 */
export function createChalkMock() {
  return {
    default: chalk,
    red: chalk,
    green: chalk,
    yellow: chalk,
    cyan: chalk,
    blue: chalk,
    gray: chalk,
    white: chalk,
    magenta: chalk,
    bold: chalk,
  };
}

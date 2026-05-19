import { vi } from 'vitest';

const identity = (s: string) => s;

// Support chalk.cyan, chalk.bold.cyan, chalk.bold.cyan.underline — any chain
const handler: ProxyHandler<typeof identity> = {
  get: (target, prop) => {
    if (prop === 'then' || prop === 'catch') return undefined; // not a Promise
    // Return the proxy itself for any property access — this enables
    // arbitrary chaining: chalk.bold.cyan('text'), chalk.red.bold.underline('x')
    return proxy;
  },
  apply: (target, thisArg, args) => {
    if (typeof args[0] === 'string') return args[0];
    return '';
  },
};

const proxy = new Proxy(identity, handler) as any;
proxy.default = proxy;

export default proxy;

/**
 * Call this in a test file's vi.mock('chalk', ...) callback to get
 * the full chainable chalk mock. Usage:
 *
 *   vi.mock('chalk', () => createChalkMock());
 */
export function createChalkMock() {
  return {
    default: proxy,
    red: proxy,
    green: proxy,
    yellow: proxy,
    cyan: proxy,
    blue: proxy,
    gray: proxy,
    white: proxy,
    magenta: proxy,
    bold: proxy,
  };
}

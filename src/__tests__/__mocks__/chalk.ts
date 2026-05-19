import { vi } from 'vitest';

const identity = (s: string) => s;

// Create a style function that returns a string when called, but
// has arbitrary method chaining that also returns style functions.
function makeChalkFn(): any {
  // The base function: when called directly, returns the input string
  const fn: any = (s: string) => (typeof s === 'string' ? s : '');
  return new Proxy(fn, {
    get: (target, prop) => {
      if (prop === 'then' || prop === 'catch' || prop === Symbol.toPrimitive) return undefined;
      // For style methods like hex(), bgHex(), etc.:
      // chalk.bold.hex('#58a6ff')('text')
      // hex('#58a6ff') should return a function that accepts text
      if (prop === 'hex' || prop === 'bgHex' || prop === 'keyword' || prop === 'hsl' || prop === 'rgb') {
        return (_color: string) => makeChalkFn();
      }
      // Everything else returns a chalk function (for chaining)
      // chalk.red, chalk.bold, chalk.dim, chalk.bold.hex(...)
      return makeChalkFn();
    },
    apply: (target, thisArg, args) => {
      if (typeof args[0] === 'string') return args[0];
      return '';
    },
  });
}

const chalkFn = makeChalkFn();
chalkFn.default = chalkFn;

export default chalkFn;

/**
 * Call this in a test file's vi.mock('chalk', ...) callback to get
 * the full chainable chalk mock. Usage:
 *
 *   vi.mock('chalk', () => createChalkMock());
 */
export function createChalkMock() {
  return {
    default: chalkFn,
    red: chalkFn,
    green: chalkFn,
    yellow: chalkFn,
    cyan: chalkFn,
    blue: chalkFn,
    gray: chalkFn,
    white: chalkFn,
    magenta: chalkFn,
    bold: chalkFn,
    dim: chalkFn,
    hex: chalkFn,
    bgHex: chalkFn,
  };
}

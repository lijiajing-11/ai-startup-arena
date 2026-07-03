import { describe, expect, it } from 'vitest';
import { cacheGet, cacheSet } from '../src/core/cache.js';

describe('cache helpers', () => {
  it('returns null for a missing key', async () => {
    await expect(cacheGet('missing-key-' + Date.now())).resolves.toBeNull();
  });

  it('returns cached data before ttl expires', async () => {
    const key = 'cache-hit-' + Date.now();
    const payload = { value: 'ok', count: 2 };

    await cacheSet(key, payload, 60_000);

    await expect(cacheGet<typeof payload>(key)).resolves.toEqual(payload);
  });

  it('returns null after ttl expires', async () => {
    const key = 'cache-expired-' + Date.now();
    const payload = { value: 'stale' };

    await cacheSet(key, payload, -1);

    await expect(cacheGet<typeof payload>(key)).resolves.toBeNull();
  });
});

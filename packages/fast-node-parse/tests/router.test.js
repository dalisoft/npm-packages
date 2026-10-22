import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Router } from '../src/node.js';

describe('Router', () => {
  it('matches, parses and looks up static routes', () => {
    const router = new Router();

    router.insert('GET', '/ping', 'pong');

    assert.equal(router.match('GET', '/ping'), true);
    assert.equal(router.match('GET', '/ping/'), true);
    assert.deepEqual(router.parse('GET', '/ping'), {});
    assert.equal(router.lookup('GET', '/ping'), 'pong');
  });

  it('handles parameters', () => {
    const router = new Router();

    router.insert('GET', '/users/:id/profile', 'profile');

    assert.equal(router.match('GET', '/users/42/profile'), true);
    assert.deepEqual(router.parse('GET', '/users/42/profile'), { id: '42' });
    assert.equal(router.lookup('GET', '/users/42/profile'), 'profile');
    assert.equal(router.match('GET', '/users/42'), false);
  });

  it('distinguishes HTTP methods', () => {
    const router = new Router();

    router.insert('GET', '/users', 'get-users');
    router.insert('POST', '/users', 'create-user');

    assert.equal(router.match('GET', '/users'), true);
    assert.equal(router.match('POST', '/users'), true);
    assert.equal(router.match('DELETE', '/users'), false);
    assert.equal(router.lookup('POST', '/users'), 'create-user');
  });

  it('prioritizes static routes over dynamic ones', () => {
    const router = new Router();

    router.insert('GET', '/users/:id', 'dynamic');
    router.insert('GET', '/users/me', 'static');

    assert.equal(router.lookup('GET', '/users/me'), 'static');
    assert.equal(router.lookup('GET', '/users/123'), 'dynamic');
  });

  it('supports wildcard routes', () => {
    const router = new Router();

    router.insert('GET', '/files/*', 'wild');
    router.insert('GET', '/files/:dir/info', 'info');

    assert.equal(router.match('GET', '/files/report.pdf'), true);
    assert.deepEqual(router.parse('GET', '/files/report.pdf'), {
      '*': 'report.pdf'
    });
    assert.equal(router.lookup('GET', '/files/report.pdf'), 'wild');

    assert.equal(router.match('GET', '/files/docs/info'), true);
    assert.deepEqual(router.parse('GET', '/files/docs/info'), { dir: 'docs' });
    assert.equal(router.lookup('GET', '/files/docs/info'), 'info');
  });

  it('executes descriptors on lookup', () => {
    const router = new Router();
    let calls = 0;

    router.insert('GET', '/tasks/:id', {
      descriptor: ({ params }) => {
        calls++;

        return { ...params, calls };
      }
    });

    assert.deepEqual(router.lookup('GET', '/tasks/9'), {
      calls: 1,
      id: '9'
    });

    assert.equal(calls, 1);
  });

  it('returns false for missing routes', () => {
    const router = new Router();

    router.insert('GET', '/health', 'ok');

    assert.equal(router.match('GET', '/missing'), false);
    assert.equal(router.parse('GET', '/missing'), false);
    assert.equal(router.lookup('GET', '/missing'), false);
  });

  it('binds router with raw normalization', () => {
    const router = new Router();

    router.insert('get', '/bound/:id', {
      descriptor: ({ params }) => params.id
    });

    const bound = router.bind('get', { normalize: 'raw' });
    const paramsOut = {};

    assert.equal(bound.match('/bound/42'), true);
    assert.equal(bound.match('bound/42'), false);
    assert.strictEqual(bound.parse('/bound/42', paramsOut), paramsOut);
    assert.deepEqual(paramsOut, { id: '42' });
    assert.equal(bound.lookup('/bound/42'), '42');
  });

  it('reuses parse output object and clears stale keys', () => {
    const router = new Router();

    router.insert('GET', '/foo/:id/:kind', 'payload');

    const params = { leftover: 'yes' };

    assert.strictEqual(router.parse('GET', '/foo/1/a', params), params);
    assert.deepEqual(params, { id: '1', kind: 'a' });
    assert.equal(router.parse('GET', '/foo/1', params), false);
    assert.deepEqual(params, {});
  });

  it('reuses params object on lookup when provided', () => {
    const router = new Router();

    router.insert('GET', '/teams/:team/members/:id', {
      descriptor: ({ params }) => ({
        teamMember: `${params.team}:${params.id}`
      })
    });

    const params = { cached: 'value' };

    assert.deepEqual(router.lookup('GET', '/teams/a/members/7', params), {
      teamMember: 'a:7'
    });
    assert.deepEqual(params, { id: '7', team: 'a' });
  });
});

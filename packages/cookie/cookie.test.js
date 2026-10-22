import assert from 'node:assert/strict';
import test from 'node:test';
import { getFromHeaders, parse, remove, set, stringify } from './cookie.js';

test('Cookie core features', (_t) => {
  assert.deepEqual(
    parse('foo=bar'),
    { foo: 'bar' },
    'Parse feature does not work properly'
  );
  assert.equal(
    stringify({ bar: 'baz' }),
    'bar=baz',
    'Stringify feature does not work properly'
  );
  assert.deepEqual(
    getFromHeaders({ cookie: 'user=john_doe' }),
    { user: 'john_doe' },
    'Get from header feature does not work properly'
  );
});

test('Cookie basic features', (_t) => {
  // Fake Framework.Core.prototype.Response
  const cookie = {};
  const res = {
    setCookie(key, value, options = {}) {
      if (options.expiresIn !== undefined && options.expiresIn < Date.now()) {
        delete cookie[key];
      } else {
        cookie[key] = value;
      }
    }
  };

  set(res, 'foo', 'bar');

  assert.equal(cookie.foo, 'bar', 'Set does not work properly');

  remove(res, 'foo');

  assert.notEqual(cookie.foo, 'bar', 'Remove does not work properly');
});

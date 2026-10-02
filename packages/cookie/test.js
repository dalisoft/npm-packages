const test = require('node:test');
const assert = require('node:assert/strict');
const { parse, stringify, getFromHeaders, set, remove } = require('./cookie');

test('Cookie core features', (t) => {
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

test('Cookie basic features', (t) => {
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

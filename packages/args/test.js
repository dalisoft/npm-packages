const test = require('node:test');
const assert = require('node:assert/strict');
const args = require('.');

test('Basic test', (t) => {
  const fn1 = (arg1) => arg1 && assert.ok(true, 'Argument was passed', arg1);
  const fn2 = (arg1, arg2) =>
    assert.notEqual(arg1, arg2, 'Function with 2 arguments was failed');
  const fn3 = (arg1, arg2, arg3) => {
    assert.notEqual(arg1, arg2, 'Function with 3 arguments was failed');
    assert.equal(arg1, arg3, 'Function with 3 arguments was failed');
  };

  args(fn1, ['argument first']);
  args(fn2, ['First argument', 'second argument']);
  args(fn3, ['Argument', 'second argument', 'Argument']);
});

test('Type and Value parsing test', (t) => {
  const num = (n, excepted) => {
    assert.equal(n, excepted, 'Number parsing does not work as excepted');
    assert.equal(
      typeof n,
      'number',
      'Number type parsing does not work as excepted'
    );
  };
  const arr = (someArr, excepted) => {
    assert.deepEqual(
      someArr,
      excepted,
      'Array parsing does not work as excepted'
    );
    assert.ok(
      Array.isArray(someArr),
      'Array type parsing does not work as excepted'
    );
  };
  const obj = (someObj, excepted) => {
    assert.deepEqual(
      someObj,
      excepted,
      'Object parsing does not work as excepted'
    );
    assert.equal(
      typeof someObj,
      'object',
      'Object type parsing does not work as excepted'
    );
  };
  const str = (s, excepted) => {
    assert.equal(s, excepted, 'String parsing does not work as excepted');
    assert.equal(
      typeof s,
      'string',
      'String type parsing does not work as excepted'
    );
  };

  function normalizeArg(type) {
    if (typeof type !== 'string') {
      return type;
    }
    if (
      type.charAt(0) === '{' ||
      (type.charAt(0) === '[' && typeof JSON !== 'undefined')
    ) {
      return JSON.parse(type);
    }
    if (isNaN(+type)) {
      return type;
    }
    return +type;
  }

  const parse = (args) => {
    return args.map(normalizeArg);
  };

  args(num, ['500', 500], parse);
  args(arr, ['[1,2,3]', [1, 2, 3]], parse);
  args(obj, ['{"foo":"bar"}', { foo: 'bar' }], parse);
  args(str, ['1 is not 2', '1 is not 2'], parse);
});

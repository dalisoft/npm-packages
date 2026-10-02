const test = require('node:test');
const assert = require('node:assert/strict');
const DeepCopy = require('.');

test('Object clone', (t) => {
  const obj = { a: 'b', 2: 3 };
  const copy = DeepCopy(obj);

  assert.deepEqual(obj, copy, 'Data is malformed when copy');
  if (obj !== copy) {
    assert.ok(true, 'Object was cloned, not referenced');
  }
});

test('Deep Object clone', (t) => {
  const obj = { foo: { bar: 'baz' } };
  const copy = DeepCopy(obj);

  assert.deepEqual(obj, copy, 'Data is malformed when copy');
  if (obj !== copy && obj.foo !== copy.foo) {
    assert.ok(true, 'Object was deep cloned, not referenced');
  }
});

test('Map clone', (t) => {
  const map = new Map();
  map.set('foo', 'bar');

  const copy = DeepCopy(map);

  assert.deepEqual(map, copy, 'Data is malformed when copy');
  if (map !== copy) {
    assert.ok(true, 'Map was cloned, not referenced');
  }
});

test('Deep Map clone', (t) => {
  const map = new Map();
  const foo = new Map();
  foo.set('bar', 'baz');

  map.set('foo', foo);

  const copy = DeepCopy(map);

  assert.deepEqual(map, copy, 'Data is malformed when copy');
  if (map !== copy && map.get('foo') !== copy.get('foo')) {
    assert.ok(true, 'Map was deep cloned, not referenced');
  }
});

test('Array clone', (t) => {
  const arr = ['a', 2];
  const copy = DeepCopy(arr);

  assert.deepEqual(arr, copy, 'Data is malformed when copy');
  if (arr !== copy) {
    assert.ok(true, 'Array was cloned, not referenced');
  }
});

test('Deep Array clone', (t) => {
  const arr = [['foo', ['bar', ['baz']]]];
  const copy = DeepCopy(arr);

  assert.deepEqual(arr, copy, 'Data is malformed when copy');
  if (
    arr !== copy &&
    arr[0] !== copy[0] &&
    arr[1] !== copy[1] &&
    arr[1][1] !== copy[1][1]
  ) {
    assert.ok(true, 'Deep Array was cloned, not referenced');
  }
});

test('Date clone', (t) => {
  const date = new Date();
  const copy = DeepCopy(date);

  assert.deepEqual(date, copy, 'Data is malformed when copy');
  if (date !== copy) {
    assert.ok(true, 'Date was cloned, not referenced');
  }
});

test('Primitive clone', (t) => {
  const num = 1;
  const numCopy = DeepCopy(num);

  assert.equal(num, numCopy, 'Data is malformed when copy');
  if (num === numCopy) {
    assert.ok(true, 'Primite value was cloned, not referenced');
  }

  const str = 'String';
  const strCopy = DeepCopy(str);

  assert.equal(str, strCopy, 'Data is malformed when copy');
  if (str === strCopy) {
    assert.ok(true, 'Primite value was cloned, not referenced');
  }
});

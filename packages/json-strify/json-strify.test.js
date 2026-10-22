import assert from 'node:assert/strict';
import test from 'node:test';
import strify from './json-strify.js';

test('stringify number', (_t) => {
  const instance = strify();
  const obj = { a: 1 };
  const str = instance(obj);

  assert.equal(
    str,
    JSON.stringify(obj),
    'Stringify Number not works as excepted'
  );
});

test('stringify string', (_t) => {
  const instance = strify();
  const obj = { b: 'string in object' };
  const str = instance(obj);

  assert.equal(
    str,
    JSON.stringify(obj),
    'Stringify String not works as excepted'
  );

  const str2 = 'This is "string"';
  const str2conv = instance(str2);

  assert.equal(
    str2conv,
    JSON.stringify('This is "string"'),
    'Stringify not works as excepted'
  );
});

test('stringify boolean', (_t) => {
  const instance = strify();
  const obj = { c: false };
  const str = instance(obj);

  assert.equal(
    str,
    JSON.stringify(obj),
    'Stringify Boolean not works as excepted'
  );
});

test('stringify array', (_t) => {
  const instance = strify();
  const obj = { baz: [1, 'two'] };
  const str = instance(obj);

  assert.equal(
    str,
    JSON.stringify(obj),
    'Stringify Array not works as excepted'
  );
});

test('stringify object', (_t) => {
  const instance = strify();
  const obj = { foo: { bar: 'baz' } };

  const str = instance(obj);

  assert.equal(
    str,
    JSON.stringify(obj),
    'Stringify Object not works as excepted'
  );
});

test('stringify circular', (_t) => {
  const instance = strify();
  const obj = { foo: { bar: 'baz' } };
  obj.foo.xyz = obj.foo;
  obj.bar = [1, 2, [obj, { baz: obj.foo }]];

  const str = instance(obj);

  assert.equal(
    str,
    '{"foo":{"bar":"baz","xyz":"[Circular]"},"bar":[1,2,["[Circular]",{"baz":{"bar":"baz","xyz":"[Circular]"}}]]}',
    'Stringify Object not works as excepted'
  );
});

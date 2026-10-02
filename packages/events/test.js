const test = require('node:test');
const Events = require('.');

test('Get prototype', (t) => {
  t.plan(4);

  t.assert.strictEqual(
    typeof Events.prototype.on,
    'function',
    'Prototype methods not assigned properly'
  );
  t.assert.strictEqual(
    typeof Events.prototype.once,
    'function',
    'Prototype methods not assigned properly'
  );
  t.assert.strictEqual(
    typeof Events.prototype.off,
    'function',
    'Prototype methods not assigned properly'
  );
  t.assert.strictEqual(
    typeof Events.prototype.emit,
    'function',
    'Prototype methods not assigned properly'
  );
});
test('Basic test', (t) =>
  new Promise((resolve) => {
    t.plan(5);

    const ev = new Events();

    ev.on('e1', () => t.assert.ok(true));
    ev.on('e2', () => t.assert.ok(true));
    ev.once('e3', () => t.assert.ok(true));
    ev.on('e4', () => t.assert.ok(true));

    ev.emit('e1');
    ev.emit('e2');
    ev.emit('e3');
    ev.emit('e3');
    ev.emit('e4');

    ev.off('e4');
    ev.emit('e4');

    setTimeout(() => {
      ev.emit('e1');
      resolve();
    }, 500);
  }));

test('Type and Value parsing test', (t) => {
  t.plan(8);

  const ev = new Events();

  ev.modifyArgs((args) => {
    return args.map((type) => {
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
    });
  });

  ev.on('num', (n, excepted) => {
    t.assert.strictEqual(
      n,
      excepted,
      'Number parsing does not work as excepted'
    );
    t.assert.strictEqual(
      typeof n,
      'number',
      'Number type parsing does not work as excepted'
    );
  });
  ev.on('arr', (someArr, excepted) => {
    t.assert.deepStrictEqual(
      someArr,
      excepted,
      'Array parsing does not work as excepted'
    );
    t.assert.ok(
      Array.isArray(someArr),
      'Array type parsing does not work as excepted'
    );
  });
  ev.on('obj', (someObj, excepted) => {
    t.assert.deepStrictEqual(
      someObj,
      excepted,
      'Object parsing does not work as excepted'
    );
    t.assert.strictEqual(
      typeof someObj,
      'object',
      'Object type parsing does not work as excepted'
    );
  });
  ev.once('str', (s, excepted) => {
    t.assert.strictEqual(
      s,
      excepted,
      'String parsing does not work as excepted'
    );
    t.assert.strictEqual(
      typeof s,
      'string',
      'String type parsing does not work as excepted'
    );
  });

  ev.emit('num', '500', 500);
  ev.emit('arr', '[1,2,3]', [1, 2, 3]);
  ev.emit('obj', '{"foo":"bar"}', { foo: 'bar' });
  ev.emit('str', '1 is not 2', '1 is not 2');
  ev.emit('str', '2 is not 3', '1 is not 2');
});

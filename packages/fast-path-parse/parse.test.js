const assert = require('node:assert');
const test = require('node:test');
const parsePathname = require('./parse.js');
const compilePathname = require('./compile.js');

test('fast-path-parse safe', async (t) => {
  await t.test('No segmenting', () => {
    assert.deepStrictEqual(parsePathname('/foo/bar')('/foo/bar'), {});
  });
  await t.test('Simple segmenting', () => {
    assert.deepStrictEqual(parsePathname('/foo/:id/bar')('/foo/123/bar'), {
      id: '123'
    });
  });
  await t.test('Simple two segmenting', () => {
    assert.deepStrictEqual(
      parsePathname('/foo/:id/bar/:task')('/foo/123/bar/run'),
      { id: '123', task: 'run' }
    );
  });

  await t.test('Average two segmenting', () => {
    assert.deepStrictEqual(parsePathname('/foo/:id/:task')('/foo/123/run'), {
      id: '123',
      task: 'run'
    });
  });

  await t.test('Average two segmenting 2', () => {
    assert.deepStrictEqual(
      parsePathname('/foo/:id/:task/bar')('/foo/123/run/bar'),
      { id: '123', task: 'run' }
    );
  });
});

test('fast-path-parse unsafe', async (t) => {
  await t.test('No segmenting', () => {
    assert.deepStrictEqual(compilePathname('/foo/bar')('/foo/bar'), {});
  });
  await t.test('Simple segmenting', () => {
    assert.deepStrictEqual(compilePathname('/foo/:id/bar')('/foo/123/bar'), {
      id: '123'
    });
  });
  await t.test('Simple two segmenting', () => {
    assert.deepStrictEqual(
      compilePathname('/foo/:id/bar/:task')('/foo/123/bar/run'),
      { id: '123', task: 'run' }
    );
  });

  await t.test('Average two segmenting', () => {
    assert.deepStrictEqual(compilePathname('/foo/:id/:task')('/foo/123/run'), {
      id: '123',
      task: 'run'
    });
  });

  await t.test('Average two segmenting 2', () => {
    assert.deepStrictEqual(
      compilePathname('/foo/:id/:task/bar')('/foo/123/run/bar'),
      { id: '123', task: 'run' }
    );
  });
});

test('fast-path-parse unsafe security', async (t) => {
  await t.test('process.exit security check', () => {
    assert.deepStrictEqual(
      compilePathname('/foo/process.exit(1)')('/foo/(process.exit(1))'),
      {}
    );
    assert.deepStrictEqual(compilePathname('/foo/process.exit(1)')('/foo'), {});
    assert.deepStrictEqual(
      compilePathname('/foo/:bar')('/foo/(process.exit(1))'),
      { bar: '(process.exit(1))' }
    );
    assert.deepStrictEqual(
      compilePathname('/foo/:bar')('/(process.exit(1))'),
      {}
    );
    assert.deepStrictEqual(compilePathname('/:bar')('/(process.exit(1))'), {
      bar: '(process.exit(1))'
    });
  });
  await t.test('throw security check', () => {
    assert.deepStrictEqual(compilePathname('/foo/throw 1')('/foo throw 1'), {});
    assert.deepStrictEqual(compilePathname('/foo/throw 1')('/foo'), {});
    assert.deepStrictEqual(compilePathname('/foo/:bar')('/foo/throw 1'), {
      bar: 'throw 1'
    });
    assert.deepStrictEqual(compilePathname('/foo/:bar')('/throw 1'), {});
    assert.deepStrictEqual(compilePathname('/:bar')('/throw 1'), {
      bar: 'throw 1'
    });
  });
});

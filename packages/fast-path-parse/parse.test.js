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

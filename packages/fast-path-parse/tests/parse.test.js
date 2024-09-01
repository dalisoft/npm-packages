// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable max-lines, max-lines-per-function */
const assert = require('node:assert');
const { describe, it } = require('node:test');
const parsePathname = require('../runtime/parse.js');
const compilePathname = require('../aot/parse.js');

describe('fast-path-parse/parse safe', async () => {
  await it('No segmenting', () => {
    assert.deepStrictEqual(parsePathname('/foo/bar')('/foo/bar'), {});
    assert.deepStrictEqual(parsePathname('/foo/bar/')('/foo/bar'), {});
    assert.deepStrictEqual(parsePathname('/foo/bar')('/foo/bar/'), {});
    assert.deepStrictEqual(parsePathname('/foo/bar/')('/foo/bar/'), {});
  });
  await it('Simple segmenting', () => {
    assert.deepStrictEqual(parsePathname('/foo/:id/bar')('/foo/123/bar'), {
      id: '123'
    });
    assert.deepStrictEqual(parsePathname('/foo/:id/bar/')('/foo/123/bar'), {
      id: '123'
    });
    assert.deepStrictEqual(parsePathname('/foo/:id/bar')('/foo/123/bar/'), {
      id: '123'
    });
    assert.deepStrictEqual(parsePathname('/foo/:id/bar/')('/foo/123/bar/'), {
      id: '123'
    });
  });
  await it('Simple two segmenting', () => {
    assert.deepStrictEqual(
      parsePathname('/foo/:id/bar/:task')('/foo/123/bar/run'),
      { id: '123', task: 'run' }
    );
    assert.deepStrictEqual(
      parsePathname('/foo/:id/bar/:task/')('/foo/123/bar/run'),
      { id: '123', task: 'run' }
    );
    assert.deepStrictEqual(
      parsePathname('/foo/:id/bar/:task')('/foo/123/bar/run/'),
      { id: '123', task: 'run' }
    );
    assert.deepStrictEqual(
      parsePathname('/foo/:id/bar/:task/')('/foo/123/bar/run/'),
      { id: '123', task: 'run' }
    );
  });

  await it('Average two segmenting', () => {
    assert.deepStrictEqual(parsePathname('/foo/:id/:task')('/foo/123/run'), {
      id: '123',
      task: 'run'
    });
    assert.deepStrictEqual(parsePathname('/foo/:id/:task/')('/foo/123/run'), {
      id: '123',
      task: 'run'
    });
    assert.deepStrictEqual(parsePathname('/foo/:id/:task')('/foo/123/run/'), {
      id: '123',
      task: 'run'
    });
    assert.deepStrictEqual(parsePathname('/foo/:id/:task/')('/foo/123/run/'), {
      id: '123',
      task: 'run'
    });
  });

  await it('Average two segmenting 2', () => {
    assert.deepStrictEqual(
      parsePathname('/foo/:id/:task/bar')('/foo/123/run/bar'),
      { id: '123', task: 'run' }
    );
    assert.deepStrictEqual(
      parsePathname('/foo/:id/:task/bar/')('/foo/123/run/bar'),
      { id: '123', task: 'run' }
    );
    assert.deepStrictEqual(
      parsePathname('/foo/:id/:task/bar')('/foo/123/run/bar/'),
      { id: '123', task: 'run' }
    );
    assert.deepStrictEqual(
      parsePathname('/foo/:id/:task/bar/')('/foo/123/run/bar/'),
      { id: '123', task: 'run' }
    );
  });

  await it('Simple * segment', () => {
    assert.deepStrictEqual(parsePathname('/foo/*/bar')('/foo/123/bar'), {
      '*1': '123'
    });
    assert.deepStrictEqual(parsePathname('/foo/*/bar/*')('/foo/123/bar/run'), {
      '*1': '123',
      '*2': 'run'
    });
  });

  await it('Average * segment', () => {
    assert.deepStrictEqual(parsePathname('/foo/:id/*')('/foo/123/bar'), {
      id: '123',
      '*1': 'bar'
    });
    assert.deepStrictEqual(parsePathname('/foo/*/*/*')('/foo/123/bar/run'), {
      '*1': '123',
      '*2': 'bar',
      '*3': 'run'
    });
    assert.deepStrictEqual(parsePathname('/foo/*/:id/*')('/foo/123/bar/run'), {
      '*1': '123',
      id: 'bar',
      '*2': 'run'
    });
    assert.deepStrictEqual(
      parsePathname('/foo/*/:id/(.*)')('/foo/123/bar/run'),
      {
        '*1': '123',
        id: 'bar',
        '*2': 'run'
      }
    );
  });
});

describe('fast-path-parse/parse unsafe', async () => {
  await it('No segmenting', () => {
    assert.deepStrictEqual(compilePathname('/foo/bar')('/foo/bar'), {});
  });
  await it('Simple segmenting', () => {
    assert.deepStrictEqual(compilePathname('/foo/:id/bar')('/foo/123/bar'), {
      id: '123'
    });
  });
  await it('Simple two segmenting', () => {
    assert.deepStrictEqual(
      compilePathname('/foo/:id/bar/:task')('/foo/123/bar/run'),
      { id: '123', task: 'run' }
    );
  });

  await it('Average two segmenting', () => {
    assert.deepStrictEqual(compilePathname('/foo/:id/:task')('/foo/123/run'), {
      id: '123',
      task: 'run'
    });
  });

  await it('Average two segmenting 2', () => {
    assert.deepStrictEqual(
      compilePathname('/foo/:id/:task/bar')('/foo/123/run/bar'),
      { id: '123', task: 'run' }
    );
  });
  await it('Simple * segment', () => {
    assert.deepStrictEqual(compilePathname('/foo/*/bar')('/foo/123/bar'), {
      '*1': '123'
    });
    assert.deepStrictEqual(
      compilePathname('/foo/*/bar/*')('/foo/123/bar/run'),
      {
        '*1': '123',
        '*2': 'run'
      }
    );
  });

  await it('Average * segment', () => {
    assert.deepStrictEqual(compilePathname('/foo/:id/*')('/foo/123/bar'), {
      id: '123',
      '*1': 'bar'
    });
    assert.deepStrictEqual(parsePathname('/foo/*/*/*')('/foo/123/bar/run'), {
      '*1': '123',
      '*2': 'bar',
      '*3': 'run'
    });
    assert.deepStrictEqual(
      compilePathname('/foo/*/:id/*')('/foo/123/bar/run'),
      {
        '*1': '123',
        id: 'bar',
        '*2': 'run'
      }
    );
    assert.deepStrictEqual(
      compilePathname('/foo/*/:id/(.*)')('/foo/123/bar/run'),
      {
        '*1': '123',
        id: 'bar',
        '*2': 'run'
      }
    );
  });
});

describe('fast-path-parse/parse unsafe security', async () => {
  await it('process.exit security check', () => {
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
  await it('throw security check', () => {
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

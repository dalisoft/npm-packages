// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable max-lines-per-function */
const assert = require('node:assert');
const { describe, it } = require('node:test');
const matchPathname = require('../runtime/match.js');
const compilePathname = require('../aot/match.js');

describe('fast-path-parse/match safe', async () => {
  await it('No segmenting', () => {
    assert.equal(matchPathname('/foo/bar')('/foo/bar'), true);
    assert.equal(matchPathname('/foo/bar/')('/foo/bar'), true);
    assert.equal(matchPathname('/foo/bar')('/foo/bar/'), true);
    assert.equal(matchPathname('/foo/bar/')('/foo/bar/'), true);
  });
  await it('Simple segmenting', () => {
    assert.equal(matchPathname('/foo/:id/bar')('/foo/123/bar'), true);
    assert.equal(matchPathname('/foo/:id/bar/')('/foo/123/bar'), true);
    assert.equal(matchPathname('/foo/:id/bar')('/foo/123/bar/'), true);
    assert.equal(matchPathname('/foo/:id/bar/')('/foo/123/bar/'), true);
  });
  await it('Simple two segmenting', () => {
    assert.equal(matchPathname('/foo/:id/bar/:task')('/foo/123/bar/run'), true);
    assert.equal(
      matchPathname('/foo/:id/bar/:task/')('/foo/123/bar/run'),
      true
    );
    assert.equal(
      matchPathname('/foo/:id/bar/:task')('/foo/123/bar/run/'),
      true
    );
    assert.equal(
      matchPathname('/foo/:id/bar/:task/')('/foo/123/bar/run/'),
      true
    );
  });

  await it('Average two segmenting', () => {
    assert.equal(matchPathname('/foo/:id/:task')('/foo/123/run'), true);
    assert.equal(matchPathname('/foo/:id/:task/')('/foo/123/run'), true);
    assert.equal(matchPathname('/foo/:id/:task')('/foo/123/run/'), true);
    assert.equal(matchPathname('/foo/:id/:task/')('/foo/123/run/'), true);
  });

  await it('Average two segmenting 2', () => {
    assert.equal(matchPathname('/foo/:id/:task/bar')('/foo/123/run/bar'), true);
    assert.equal(
      matchPathname('/foo/:id/:task/bar/')('/foo/123/run/bar'),
      true
    );
    assert.equal(
      matchPathname('/foo/:id/:task/bar')('/foo/123/run/bar/'),
      true
    );
    assert.equal(
      matchPathname('/foo/:id/:task/bar/')('/foo/123/run/bar/'),
      true
    );
  });
});

describe('fast-path-parse/match unsafe', async () => {
  await it('No segmenting', () => {
    assert.equal(compilePathname('/foo/bar')('/foo/bar'), true);
    assert.equal(compilePathname('/foo/bar/')('/foo/bar'), true);
    assert.equal(compilePathname('/foo/bar')('/foo/bar/'), true);
    assert.equal(compilePathname('/foo/bar/')('/foo/bar/'), true);
  });
  await it('Simple segmenting', () => {
    assert.equal(compilePathname('/foo/:id/bar')('/foo/123/bar'), true);
    assert.equal(compilePathname('/foo/:id/bar/')('/foo/123/bar'), true);
    assert.equal(compilePathname('/foo/:id/bar')('/foo/123/bar/'), true);
    assert.equal(compilePathname('/foo/:id/bar/')('/foo/123/bar/'), true);
  });
  await it('Simple two segmenting', () => {
    assert.equal(
      compilePathname('/foo/:id/bar/:task')('/foo/123/bar/run'),
      true
    );
    assert.equal(
      compilePathname('/foo/:id/bar/:task/')('/foo/123/bar/run'),
      true
    );
    assert.equal(
      compilePathname('/foo/:id/bar/:task')('/foo/123/bar/run/'),
      true
    );
    assert.equal(
      compilePathname('/foo/:id/bar/:task/')('/foo/123/bar/run/'),
      true
    );
  });

  await it('Average two segmenting', () => {
    assert.equal(compilePathname('/foo/:id/:task')('/foo/123/run'), true);
    assert.equal(compilePathname('/foo/:id/:task/')('/foo/123/run'), true);
    assert.equal(compilePathname('/foo/:id/:task')('/foo/123/run/'), true);
    assert.equal(compilePathname('/foo/:id/:task/')('/foo/123/run/'), true);
  });

  await it('Average two segmenting 2', () => {
    assert.equal(
      compilePathname('/foo/:id/:task/bar')('/foo/123/run/bar'),
      true
    );
    assert.equal(
      compilePathname('/foo/:id/:task/bar/')('/foo/123/run/bar'),
      true
    );
    assert.equal(
      compilePathname('/foo/:id/:task/bar')('/foo/123/run/bar/'),
      true
    );
    assert.equal(
      compilePathname('/foo/:id/:task/bar/')('/foo/123/run/bar/'),
      true
    );
  });
});

describe('fast-path-parse/match unsafe security', async () => {
  await it('process.exit security check', () => {
    assert.equal(
      compilePathname('/foo/process.exit(1)')('/foo/(process.exit(1))'),
      false
    );
    assert.equal(compilePathname('/foo/process.exit(1)')('/foo'), false);
    assert.equal(compilePathname('/foo/:bar')('/foo/(process.exit(1))'), true);
    assert.equal(compilePathname('/foo/:bar')('/(process.exit(1))'), false);
    assert.equal(compilePathname('/:bar')('/(process.exit(1))'), true);
  });
  await it('throw security check', () => {
    assert.equal(compilePathname('/foo/throw 1')('/foo throw 1'), false);
    assert.equal(compilePathname('/foo/throw 1')('/foo'), false);
    assert.equal(compilePathname('/foo/:bar')('/foo/throw 1'), true);
    assert.equal(compilePathname('/foo/:bar')('/throw 1'), false);
    assert.equal(compilePathname('/:bar')('/throw 1'), true);
  });
});

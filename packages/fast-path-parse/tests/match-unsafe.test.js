const assert = require('node:assert');
const { describe, it } = require('node:test');
const match = require('../aot/match.js');

describe('fast-path-parse/match unsafe', async () => {
  await it('No segmenting', () => {
    assert.equal(match('/foo/bar')('/foo/bar'), true);
    assert.equal(match('/foo/bar/')('/foo/bar'), true);
    assert.equal(match('/foo/bar')('/foo/bar/'), true);
    assert.equal(match('/foo/bar/')('/foo/bar/'), true);
  });
  await it('Simple segmenting, `:id`', () => {
    assert.equal(match('/foo/:id/bar')('/foo/123/bar'), true);
    assert.equal(match('/foo/:id/bar/')('/foo/123/bar'), true);
    assert.equal(match('/foo/:id/bar')('/foo/123/bar/'), true);
    assert.equal(match('/foo/:id/bar/')('/foo/123/bar/'), true);
  });
  await it('Simple segmenting, `<id>`', () => {
    assert.equal(match('/foo/<id>/bar')('/foo/123/bar'), true);
    assert.equal(match('/foo/<id>/bar/')('/foo/123/bar'), true);
    assert.equal(match('/foo/<id>/bar')('/foo/123/bar/'), true);
    assert.equal(match('/foo/<id>/bar/')('/foo/123/bar/'), true);
  });
  await it('Simple two segmenting', () => {
    assert.equal(match('/foo/:id/bar/:task')('/foo/123/bar/run'), true);
    assert.equal(match('/foo/:id/bar/:task/')('/foo/123/bar/run'), true);
    assert.equal(match('/foo/:id/bar/:task')('/foo/123/bar/run/'), true);
    assert.equal(match('/foo/:id/bar/:task/')('/foo/123/bar/run/'), true);
  });

  await it('Average two segmenting', () => {
    assert.equal(match('/foo/:id/:task')('/foo/123/run'), true);
    assert.equal(match('/foo/:id/:task/')('/foo/123/run'), true);
    assert.equal(match('/foo/:id/:task')('/foo/123/run/'), true);
    assert.equal(match('/foo/:id/:task/')('/foo/123/run/'), true);
  });

  await it('Average two segmenting 2', () => {
    assert.equal(match('/foo/:id/:task/bar')('/foo/123/run/bar'), true);
    assert.equal(match('/foo/:id/:task/bar/')('/foo/123/run/bar'), true);
    assert.equal(match('/foo/:id/:task/bar')('/foo/123/run/bar/'), true);
    assert.equal(match('/foo/:id/:task/bar/')('/foo/123/run/bar/'), true);
  });
});

describe('fast-path-parse/match unsafe security', async () => {
  await it('process.exit security check', () => {
    assert.equal(
      match('/foo/process.exit(1)')('/foo/(process.exit(1))'),
      false
    );
    assert.equal(match('/foo/process.exit(1)')('/foo'), false);
    assert.equal(match('/foo/:bar')('/foo/(process.exit(1))'), true);
    assert.equal(match('/foo/:bar')('/(process.exit(1))'), false);
    assert.equal(match('/:bar')('/(process.exit(1))'), true);
  });
  await it('throw security check', () => {
    assert.equal(match('/foo/throw 1')('/foo throw 1'), false);
    assert.equal(match('/foo/throw 1')('/foo'), false);
    assert.equal(match('/foo/:bar')('/foo/throw 1'), true);
    assert.equal(match('/foo/:bar')('/throw 1'), false);
    assert.equal(match('/:bar')('/throw 1'), true);
  });
});

const assert = require('node:assert');
const { describe, it } = require('node:test');
const match = require('../runtime/match.js');

describe('fast-path-parse/match safe', async () => {
  await it('No segmenting', () => {
    assert.equal(match('/foo/bar')('/foo/bar'), true);
    assert.equal(match('/foo/bar/')('/foo/bar'), true);
    assert.equal(match('/foo/bar')('/foo/bar/'), true);
    assert.equal(match('/foo/bar/')('/foo/bar/'), true);
  });
  await it('Simple segmenting', () => {
    assert.equal(match('/foo/:id/bar')('/foo/123/bar'), true);
    assert.equal(match('/foo/:id/bar/')('/foo/123/bar'), true);
    assert.equal(match('/foo/:id/bar')('/foo/123/bar/'), true);
    assert.equal(match('/foo/:id/bar/')('/foo/123/bar/'), true);
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

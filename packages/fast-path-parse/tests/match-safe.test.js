const assert = require('node:assert');
const { describe, it } = require('node:test');
const match = require('../runtime/match.js');

describe('fast-path-parse/match safe', () => {
  describe('No segmenting', () => {
    it('/foo/bar', () => assert.equal(match('/foo/bar')('/foo/bar'), true));
    it('/foo/bar/', () => assert.equal(match('/foo/bar/')('/foo/bar'), true));
    it('/foo/bar', () => assert.equal(match('/foo/bar')('/foo/bar/'), true));
    it('/foo/bar/', () => assert.equal(match('/foo/bar/')('/foo/bar/'), true));
  });

  describe('Simple segmenting, `:id`', () => {
    it('/foo/:id/bar', () =>
      assert.equal(match('/foo/:id/bar')('/foo/123/bar'), true));
    it('/foo/:id/bar/', () =>
      assert.equal(match('/foo/:id/bar/')('/foo/123/bar'), true));
    it('/foo/:id/bar', () =>
      assert.equal(match('/foo/:id/bar')('/foo/123/bar/'), true));
    it('/foo/:id/bar/', () =>
      assert.equal(match('/foo/:id/bar/')('/foo/123/bar/'), true));
  });

  describe('Simple compact segmenting, `:id`', () => {
    it('/foo/:id/bar/baz', () =>
      assert.equal(match('/foo/:id/bar/baz', true)('/foo/123/bar/baz'), true));
    it('/foo/:id/bar/baz/', () =>
      assert.equal(match('/foo/:id/bar/baz/', true)('/foo/123/bar/baz'), true));
    it('/foo/:id/bar/baz', () =>
      assert.equal(match('/foo/:id/bar/baz', true)('/foo/123/bar/baz/'), true));
    it('/foo/:id/bar/baz/', () =>
      assert.equal(
        match('/foo/:id/bar/baz/', true)('/foo/123/bar/baz/'),
        true
      ));
  });

  describe('Simple segmenting, `<id>`', () => {
    it('/foo/<id>/bar', () =>
      assert.equal(match('/foo/<id>/bar')('/foo/123/bar'), true));
    it('/foo/<id>/bar/', () =>
      assert.equal(match('/foo/<id>/bar/')('/foo/123/bar'), true));
    it('/foo/<id>/bar', () =>
      assert.equal(match('/foo/<id>/bar')('/foo/123/bar/'), true));
    it('/foo/<id>/bar/', () =>
      assert.equal(match('/foo/<id>/bar/')('/foo/123/bar/'), true));
  });

  describe('Simple two segmenting', () => {
    it('/foo/:id/bar/:task', () =>
      assert.equal(match('/foo/:id/bar/:task')('/foo/123/bar/run'), true));
    it('/foo/:id/bar/:task/', () =>
      assert.equal(match('/foo/:id/bar/:task/')('/foo/123/bar/run'), true));
    it('/foo/:id/bar/:task', () =>
      assert.equal(match('/foo/:id/bar/:task')('/foo/123/bar/run/'), true));
    it('/foo/:id/bar/:task/', () =>
      assert.equal(match('/foo/:id/bar/:task/')('/foo/123/bar/run/'), true));
  });

  describe('Average two segmenting', () => {
    it('/foo/:id/:task', () =>
      assert.equal(match('/foo/:id/:task')('/foo/123/run'), true));
    it('/foo/:id/:task/', () =>
      assert.equal(match('/foo/:id/:task/')('/foo/123/run'), true));
    it('/foo/:id/:task', () =>
      assert.equal(match('/foo/:id/:task')('/foo/123/run/'), true));
    it('/foo/:id/:task/', () =>
      assert.equal(match('/foo/:id/:task/')('/foo/123/run/'), true));
  });

  describe('Average two segmenting 2', () => {
    it('/foo/:id/:task/bar', () =>
      assert.equal(match('/foo/:id/:task/bar')('/foo/123/run/bar'), true));
    it('/foo/:id/:task/bar/', () =>
      assert.equal(match('/foo/:id/:task/bar/')('/foo/123/run/bar'), true));
    it('/foo/:id/:task/bar', () =>
      assert.equal(match('/foo/:id/:task/bar')('/foo/123/run/bar/'), true));
    it('/foo/:id/:task/bar/', () =>
      assert.equal(match('/foo/:id/:task/bar/')('/foo/123/run/bar/'), true));
  });
});

describe('fast-path-parse/match safe security', () => {
  describe('process.exit security check', () => {
    it('/foo/process.exit(1)', () =>
      assert.equal(
        match('/foo/process.exit(1)')('/foo/(process.exit(1))'),
        false
      ));
    it('/foo/process.exit(1)', () =>
      assert.equal(match('/foo/process.exit(1)')('/foo'), false));
    it('/foo/:bar', () =>
      assert.equal(match('/foo/:bar')('/foo/(process.exit(1))'), true));
    it('/foo/:bar', () =>
      assert.equal(match('/foo/:bar')('/(process.exit(1))'), false));
    it('/:bar', () => assert.equal(match('/:bar')('/(process.exit(1))'), true));
  });

  describe('throw security check', () => {
    it('/foo/throw 1', () =>
      assert.equal(match('/foo/throw 1')('/foo throw 1'), false));
    it('/foo/throw 1', () =>
      assert.equal(match('/foo/throw 1')('/foo'), false));
    it('/foo/:bar', () =>
      assert.equal(match('/foo/:bar')('/foo/throw 1'), true));
    it('/foo/:bar', () => assert.equal(match('/foo/:bar')('/throw 1'), false));
    it(':/bar', () => assert.equal(match('/:bar')('/throw 1'), true));
  });
});

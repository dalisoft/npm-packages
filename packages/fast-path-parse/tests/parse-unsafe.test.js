const assert = require('node:assert');
const { describe, it } = require('node:test');
const compilePathname = require('../aot/parse.js');

describe('fast-path-parse/parse unsafe', () => {
  describe('No segmenting', () => {
    it('/foo/bar', () =>
      assert.deepStrictEqual(compilePathname('/foo/bar')('/foo/bar'), {}));
    it('/foo/bar/', () =>
      assert.deepStrictEqual(compilePathname('/foo/bar/')('/foo/bar'), {}));
    it('/foo/bar', () =>
      assert.deepStrictEqual(compilePathname('/foo/bar')('/foo/bar/'), {}));
    it('/foo/bar/', () =>
      assert.deepStrictEqual(compilePathname('/foo/bar/')('/foo/bar/'), {}));
  });

  describe('Simple segmenting, `:id`', () => {
    it('/foo/:id/bar', () =>
      assert.deepStrictEqual(compilePathname('/foo/:id/bar')('/foo/123/bar'), {
        id: '123'
      }));
    it('/foo/:id/bar/', () =>
      assert.deepStrictEqual(compilePathname('/foo/:id/bar/')('/foo/123/bar'), {
        id: '123'
      }));
    it('/foo/:id/bar', () =>
      assert.deepStrictEqual(compilePathname('/foo/:id/bar')('/foo/123/bar/'), {
        id: '123'
      }));
    it('/foo/:id/bar/', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/:id/bar/')('/foo/123/bar/'),
        {
          id: '123'
        }
      ));
  });

  describe('Simple segmenting, `<id>`', () => {
    it('/foo/<id>/bar', () =>
      assert.deepStrictEqual(compilePathname('/foo/<id>/bar')('/foo/123/bar'), {
        id: '123'
      }));
    it('/foo/<id>/bar/', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/<id>/bar/')('/foo/123/bar'),
        {
          id: '123'
        }
      ));
    it('/foo/<id>/bar', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/<id>/bar')('/foo/123/bar/'),
        {
          id: '123'
        }
      ));
    it('/foo/<id>/bar/', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/<id>/bar/')('/foo/123/bar/'),
        {
          id: '123'
        }
      ));
  });

  describe('Simple two segmenting', () => {
    it('/foo/:id/bar/:task', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/:id/bar/:task')('/foo/123/bar/run'),
        { id: '123', task: 'run' }
      ));
    it('/foo/:id/bar/:task/', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/:id/bar/:task/')('/foo/123/bar/run'),
        { id: '123', task: 'run' }
      ));
    it('/foo/:id/bar/:task', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/:id/bar/:task')('/foo/123/bar/run/'),
        { id: '123', task: 'run' }
      ));
    it('/foo/:id/bar/:task/', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/:id/bar/:task/')('/foo/123/bar/run/'),
        { id: '123', task: 'run' }
      ));
  });

  describe('Average two segmenting', () => {
    it('/foo/:id/:task', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/:id/:task')('/foo/123/run'),
        {
          id: '123',
          task: 'run'
        }
      ));
    it('/foo/:id/:task/', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/:id/:task/')('/foo/123/run'),
        {
          id: '123',
          task: 'run'
        }
      ));
    it('/foo/:id/:task', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/:id/:task')('/foo/123/run/'),
        {
          id: '123',
          task: 'run'
        }
      ));
    it('/foo/:id/:task/', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/:id/:task/')('/foo/123/run/'),
        {
          id: '123',
          task: 'run'
        }
      ));
  });

  describe('Average two segmenting 2', () => {
    it('/foo/:id/:task/bar', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/:id/:task/bar')('/foo/123/run/bar'),
        { id: '123', task: 'run' }
      ));
    it('/foo/:id/:task/bar/', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/:id/:task/bar/')('/foo/123/run/bar'),
        { id: '123', task: 'run' }
      ));
    it('/foo/:id/:task/bar', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/:id/:task/bar')('/foo/123/run/bar/'),
        { id: '123', task: 'run' }
      ));
    it('/foo/:id/:task/bar/', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/:id/:task/bar/')('/foo/123/run/bar/'),
        { id: '123', task: 'run' }
      ));
  });

  describe('Simple * segment', () => {
    it('/foo/*/bar', () =>
      assert.deepStrictEqual(compilePathname('/foo/*/bar')('/foo/123/bar'), {
        '*1': '123'
      }));
    it('/foo/*/bar/', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/*/bar/*')('/foo/123/bar/run'),
        {
          '*1': '123',
          '*2': 'run'
        }
      ));
  });

  describe('Average * segment', () => {
    it('/foo/:id/*', () =>
      assert.deepStrictEqual(compilePathname('/foo/:id/*')('/foo/123/bar'), {
        id: '123',
        '*1': 'bar'
      }));
    it('/foo/*/*/*', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/*/*/*')('/foo/123/bar/run'),
        {
          '*1': '123',
          '*2': 'bar',
          '*3': 'run'
        }
      ));
    it('/foo/*/:id/*', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/*/:id/*')('/foo/123/bar/run'),
        {
          '*1': '123',
          id: 'bar',
          '*2': 'run'
        }
      ));
    it('/foo/*/:id/(.*)', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/*/:id/(.*)')('/foo/123/bar/run'),
        {
          '*1': '123',
          id: 'bar',
          '*2': 'run'
        }
      ));
  });
});

describe('fast-path-parse/parse unsafe security', () => {
  describe('process.exit security check', () => {
    it('/foo/process.exit(1)', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/process.exit(1)')('/foo/(process.exit(1))'),
        {}
      ));
    it('/foo/process.exit(1)', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/process.exit(1)')('/foo'),
        {}
      ));
    it('/foo/:bar', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/:bar')('/foo/(process.exit(1))'),
        { bar: '(process.exit(1))' }
      ));
    it('/foo/:bar', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/:bar')('/(process.exit(1))'),
        {}
      ));
    it('/:bar', () =>
      assert.deepStrictEqual(compilePathname('/:bar')('/(process.exit(1))'), {
        bar: '(process.exit(1))'
      }));
  });

  describe('throw security check', () => {
    it('/foo/throw 1', () =>
      assert.deepStrictEqual(
        compilePathname('/foo/throw 1')('/foo throw 1'),
        {}
      ));
    it('/foo/throw 1', () =>
      assert.deepStrictEqual(compilePathname('/foo/throw 1')('/foo'), {}));
    it('/foo/:bar', () =>
      assert.deepStrictEqual(compilePathname('/foo/:bar')('/foo/throw 1'), {
        bar: 'throw 1'
      }));
    it('/foo/:bar', () =>
      assert.deepStrictEqual(compilePathname('/foo/:bar')('/throw 1'), {}));
    it('/:bar', () =>
      assert.deepStrictEqual(compilePathname('/:bar')('/throw 1'), {
        bar: 'throw 1'
      }));
  });
});

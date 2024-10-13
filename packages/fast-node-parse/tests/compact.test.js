const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const Node = require('../src/node/node.js');
const Compactify = require('../src/utils/compact.js');
const { CallbackNode, RootNode } = require('../benchmark/nodes.js');

describe('node compact tree [optimized]', () => {
  describe('route matches [/foo/:id/:kind]', () => {
    const root = new Compactify('/');
    const foo = new Node('foo');
    const id = new Node(':id');
    const kind = new Node(':kind');

    root.push(foo);
    foo.push(id);
    id.push(kind);

    root.optimize();

    describe('valid routes [/foo/123/:kind]', () => {
      it('/foo/123/bar', () => assert.equal(root.match('/foo/123/bar'), true));
      it('/foo/123/baz', () => assert.equal(root.match('/foo/123/baz'), true));
      it('/foo/123/bloof', () =>
        assert.equal(root.match('/foo/123/bloof'), true));
    });

    describe('invalid routes [/foo/:id]', () => {
      it('/foo/123', () => assert.equal(root.match('/foo/123'), false));
      it('/foo/bar', () => assert.equal(root.match('/foo/bar'), false));
      it('/foo/', () => assert.equal(root.match('/foo/'), false));
    });
  });

  describe('route parse [/foo/:id/:kind]', () => {
    const root = new Compactify('/');
    const foo = new Node('foo');
    const id = new Node(':id');
    const kind = new Node(':kind');

    root.push(foo);
    foo.push(id);
    id.push(kind);

    root.optimize();

    describe('valid routes [/foo/123/:kind]', () => {
      it('/foo/123/bar', () =>
        assert.deepEqual(root.parse('/foo/123/bar'), {
          id: '123',
          kind: 'bar'
        }));
      it('/foo/123/baz', () =>
        assert.deepEqual(root.parse('/foo/123/baz'), {
          id: '123',
          kind: 'baz'
        }));
      it('/foo/123/bloof', () =>
        assert.deepEqual(root.parse('/foo/123/bloof'), {
          id: '123',
          kind: 'bloof'
        }));
    });

    describe('invalid routes [/foo/:id]', () => {
      it('/foo/123', () => assert.equal(root.parse('/foo/123'), false));
      it('/foo/bar', () => assert.equal(root.parse('/foo/bar'), false));
      it('/foo/', () => assert.equal(root.parse('/foo/'), false));
    });
  });

  describe('route lookup [/foo/:id/:kind]', () => {
    let callsCount = 0;

    const root = new RootNode('/');
    const foo = new Node('foo');
    const id = new Node(':id');
    const kind = new CallbackNode(
      'GET',
      (params) => {
        return { ...params, calls: callsCount++ };
      },
      ':kind'
    );

    root.push(foo);
    foo.push(id);
    id.push(kind);

    root.optimize(['method', 'callback']);

    describe('valid routes [/foo/123/:kind]', () => {
      it('/foo/123/bar', () =>
        assert.deepEqual(root.lookup('GET', '/foo/123/bar'), {
          id: '123',
          kind: 'bar',
          calls: 0
        }));
      it('/foo/123/baz', () =>
        assert.deepEqual(root.lookup('GET', '/foo/123/baz'), {
          id: '123',
          kind: 'baz',
          calls: 1
        }));
      it('/foo/123/bloof', () =>
        assert.deepEqual(root.lookup('GET', '/foo/123/bloof'), {
          id: '123',
          kind: 'bloof',
          calls: 2
        }));
    });

    describe('invalid routes [/foo/:id]', () => {
      it('/foo/123', () => assert.equal(root.lookup('GET', '/foo/123'), false));
      it('/foo/bar', () => assert.equal(root.lookup('GET', '/foo/bar'), false));
      it('/foo/', () => assert.equal(root.lookup('GET', '/foo/'), false));
    });
  });
});

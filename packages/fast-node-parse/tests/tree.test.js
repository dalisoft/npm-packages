const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const Node = require('../src/node/node.js');
const { CallbackNode, RootNode } = require('../benchmark/nodes.js');

describe('node tree [/foo/:id/:kind]', () => {
  describe('route matches', () => {
    const root = new Node('/');
    const foo = new Node('foo');
    const id = new Node(':id');
    const kind = new Node(':kind');

    root.push(foo);
    foo.push(id);
    id.push(kind);

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

  describe('route parse', () => {
    const root = new Node('/');
    const foo = new Node('foo');
    const id = new Node(':id');
    const kind = new Node(':kind');

    root.push(foo);
    foo.push(id);
    id.push(kind);

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

  describe('route lookup', () => {
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

describe('node tree [/foo/:id]', () => {
  describe('route matches', () => {
    const root = new Node('/');
    const foo = new Node('foo');
    const id = new Node(':id');

    root.push(foo);
    foo.push(id);

    describe('valid routes [/foo/123]', () => {
      it('/foo/123', () => assert.equal(root.match('/foo/123'), true));

      describe('invalid routes [/foo/]', () => {
        it('/foo/', () => assert.equal(root.match('/foo/'), false));
      });
    });
  });

  describe('route parse', () => {
    const root = new Node('/');
    const foo = new Node('foo');
    const id = new Node(':id');

    root.push(foo);
    foo.push(id);

    describe('valid routes [/foo/123]', () => {
      it('/foo/123', () =>
        assert.deepEqual(root.parse('/foo/123'), {
          id: '123'
        }));
    });

    describe('invalid routes [/foo/:id]', () => {
      it('/foo/', () => assert.equal(root.parse('/foo/'), false));
    });
  });

  describe('route lookup', () => {
    let callsCount = 0;

    const root = new RootNode('/');
    const foo = new Node('foo');
    const id = new CallbackNode(
      'GET',
      (params) => {
        return { ...params, calls: callsCount++ };
      },
      ':id'
    );

    root.push(foo);
    foo.push(id);

    describe('valid routes [/foo/123/]', () => {
      it('/foo/123/bar', () =>
        assert.deepEqual(root.lookup('GET', '/foo/123'), {
          id: '123',
          calls: 0
        }));
    });

    describe('invalid routes [/foo/]', () => {
      it('/foo/', () => assert.equal(root.lookup('GET', '/foo/'), false));
    });
  });
});

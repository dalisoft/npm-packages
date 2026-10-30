import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CallbackNode, RootNode } from '../benchmark/nodes.js';
import { Node } from '../src/node/node.js';

describe('node tree [/foo/:id/:kind]', () => {
  describe('multi-route siblings', () => {
    const root = new Node('/');
    const foo = new Node('foo');
    const bar = new Node('bar');
    const baz = new Node('baz');
    const id = new Node(':id');

    root.push(foo);
    foo.push(bar);
    foo.push(baz);
    bar.push(id);

    it('matches sibling branches at the same depth', () => {
      assert.equal(root.match('/foo/bar/123'), true);
      assert.equal(root.match('/foo/baz'), true);
      assert.equal(root.match('/foo/bar'), false);
    });

    it('parses the matched sibling branch', () => {
      assert.deepEqual(root.parse('/foo/bar/123'), { id: '123' });
      assert.equal(root.parse('/foo/baz'), undefined);
    });

    it('looks up the matched sibling leaf', () => {
      assert.equal(root.lookup('/foo/bar/123'), id);
      assert.equal(root.lookup('/foo/baz'), baz);
      assert.equal(root.lookup('/foo/qux'), false);
    });
  });

  describe('priority order', () => {
    const root = new Node('/');
    const foo = new Node('foo');
    const id = new Node(':id');
    const me = new Node('me');
    const wildcard = new Node('*');

    root.push(foo);
    foo.push(id);
    foo.push(wildcard);
    foo.push(me);

    it('matches static before params and params before wildcard', () => {
      assert.equal(root.lookup('/foo/me'), me);
      assert.equal(root.lookup('/foo/123'), id);
      assert.equal(root.lookup('/foo/a/b'), wildcard);
    });

    it('parses params and wildcard values', () => {
      assert.equal(root.parse('/foo/me'), undefined);
      assert.deepEqual(root.parse('/foo/123'), { id: '123' });
      assert.deepEqual(root.parse('/foo/a/b'), { '*': 'a/b' });
    });
  });

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
      it('/foo/123/bar/baz', () =>
        assert.equal(root.match('/foo/123/bar/baz'), false));
      it('/foo/123/', () => assert.equal(root.match('/foo/123/'), false));
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
      it('/foo/123/bar/baz', () =>
        assert.equal(root.parse('/foo/123/bar/baz'), false));
      it('/foo/123/', () => assert.equal(root.parse('/foo/123/'), false));
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
          calls: 0,
          id: '123',
          kind: 'bar'
        }));
      it('/foo/123/baz', () =>
        assert.deepEqual(root.lookup('GET', '/foo/123/baz'), {
          calls: 1,
          id: '123',
          kind: 'baz'
        }));
      it('/foo/123/bloof', () =>
        assert.deepEqual(root.lookup('GET', '/foo/123/bloof'), {
          calls: 2,
          id: '123',
          kind: 'bloof'
        }));
    });

    describe('invalid routes [/foo/:id]', () => {
      it('/foo/123', () => assert.equal(root.lookup('GET', '/foo/123'), false));
      it('/foo/123/bar/baz', () =>
        assert.equal(root.lookup('GET', '/foo/123/bar/baz'), false));
      it('/foo/123/', () =>
        assert.equal(root.lookup('GET', '/foo/123/'), false));
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
          calls: 0,
          id: '123'
        }));
    });

    describe('invalid routes [/foo/]', () => {
      it('/foo/', () => assert.equal(root.lookup('GET', '/foo/'), false));
    });
  });
});

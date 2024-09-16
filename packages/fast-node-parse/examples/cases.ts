import type { HttpMethod } from '../benchmark/types';
import { Node } from '../src/node.js';

/**
 * Supports only `CASE 1` for now
 */
const CASE = 1;

if (CASE === 1) {
  class KindNode extends Node {
    method: HttpMethod;

    callback: (params: Record<string, string>) => Record<string, string>;

    constructor(
      method: HttpMethod,
      handler: (params: Record<string, string>) => Record<string, string>,
      segment: string
    ) {
      super(segment);

      this.method = method;
      this.callback = handler;
    }
  }
  class RootNode extends Node {
    lookup(path: string, method: HttpMethod): false;
    lookup(path: string, method: HttpMethod) {
      const result = super.lookup(path) as false | KindNode;

      if (!result) {
        return false;
      }

      if (result.method === method) {
        return result.callback(this.parse(path));
      }

      return false;
    }
  }
  /**
   * Case 1
   */
  const root1 = new RootNode('/');
  const foo = new Node('foo');
  const id = new Node(':id');
  const kind = new KindNode(
    'GET',
    (params) => ({
      id: params.id,
      [params.kind]: 1
    }),
    ':kind'
  );

  root1.push(foo);
  foo.push(id);
  id.push(kind);

  const root2 = new Node('/');
  const foo2 = new Node('foo');
  root2.push(foo2);

  //console.log('[tree.ts:174]', '/foo/:id/bar', root1.match('/foo/123/bar'));
  //console.log('[tree.ts:175]', '/foo/:id/bar', root1.parse('/foo/123/bar'));
  //console.log('[tree.ts:179]', '/foo/:id', root1.match('GET', '/foo/123'));
  //console.log('[tree.ts:180]', '/foo/:id', root1.parse('GET', '/foo/123'));
  console.log(
    '[tree.ts:181]',
    '/foo',
    root2.match('/foo'),
    root1.lookup('/foo/123/bar', 'GET')
  );
} else if (CASE === 2) {
  /**
   * Case 2
   */
  const root2 = new Node('/').push(
    new Node('foo').push(
      new Node(':id').push(
        new Node(':kind', (params) => ({
          id: params.id,
          [params.kind]: 1
        }))
      )
    )
  );

  console.log(root2.match('GET', '/foo/123/bar'));
}

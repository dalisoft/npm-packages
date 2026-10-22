import { bench, describe } from 'vitest';
import { FastTree } from '../../fast-tree.ts';
import { config, handler } from '../config.js';

const fastTree = new FastTree();

fastTree.insert('GET', '/foo/bar', { descriptor: handler });
fastTree.insert('GET', '/foo/:id', {
  descriptor: ({ params: { id } }) => handler({ id })
});
fastTree.insert('GET', '/foo/:id/user', {
  descriptor: ({ params: { id } }) => handler({ id })
});
fastTree.insert('GET', '/foo/*', {
  descriptor: ({ params }) => handler(params)
});

describe('fast-tree lookup', () => {
  bench('static match', () => fastTree.match('GET', '/foo/bar'), config);
  bench('static lookup', () => fastTree.lookup('GET', '/foo/bar'), config);
  bench('dynamic lookup', () => fastTree.lookup('GET', '/foo/123'), config);
  bench(
    'nested dynamic lookup',
    () => fastTree.lookup('GET', '/foo/123/user'),
    config
  );
  bench('wildcard lookup', () => fastTree.lookup('GET', '/foo/a/b/c'), config);
});

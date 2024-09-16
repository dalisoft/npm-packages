import { suite, add, cycle, complete } from 'benny';
// eslint-disable-next-line n/no-unpublished-import
import { Node } from '../src/node.js';
import FindMyWay from 'find-my-way';
import { RegExpRouter } from 'hono/router/reg-exp-router';
import { CallbackNode, RootNode } from './nodes.js';
import { TrieRouter } from 'hono/router/trie-router';

const root = new RootNode('/');
const foo = new Node('foo');
const id = new Node(':id');
const kind = new CallbackNode(
  'GET',
  (params) => ({
    id: params.id,
    [params.kind]: '1'
  }),
  ':kind'
);

root.push(foo);
foo.push(id);
id.push(kind);

root.optimize(['method', 'callback']);

const route = FindMyWay({
  defaultRoute() {
    return false;
  }
});
route.on('GET', '/foo/:id/:kind', (req, res, params) => ({
  id: params.id,
  [params.kind]: 1
}));

const honoRouteRegEx = new RegExpRouter();
honoRouteRegEx.add('GET', '/foo/:id/:kind', (params) => ({
  id: params.id,
  [params.kind]: 1
}));
const honoTrieRoute = new TrieRouter();
honoTrieRoute.add('GET', '/foo/:id/:kind', (params) => ({
  id: params.id,
  [params.kind]: 1
}));

suite(
  'match',
  add('node tree match', () => {
    root.match('/foo/123/bar');
  }),
  add('hono regex match', () => {
    honoRouteRegEx.match('GET', '/foo/123/bar');
  }),
  add('hono trie match', () => {
    honoTrieRoute.match('GET', '/foo/123/bar');
  }),
  add('find-my-way', () => {
    route.find('GET', '/foo/123/bar');
  }),
  cycle(),
  complete()
);

suite(
  'parse',
  add('node tree parse', () => {
    root.parse('/foo/123/bar');
  }),
  add('hono regex parse', () => {
    const [res] = honoRouteRegEx.match('GET', '/foo/123/bar');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const params = res[0][1];
  }),
  add('hono trie parse', () => {
    const [res] = honoTrieRoute.match('GET', '/foo/123/bar');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const params = res[0][1];
  }),
  add('find-my-way', () => {
    route.find('GET', '/foo/123/bar');
  }),
  cycle(),
  complete()
);

suite(
  'lookup',
  add('node tree lookup', () => {
    root.lookup('GET', '/foo/123/bar');
  }),
  add('hono regex lookup', () => {
    const [res] = honoRouteRegEx.match('GET', '/foo/123/bar');

    res[0][0](res[0][1]);
  }),
  add('hono trie lookup', () => {
    const [res] = honoTrieRoute.match('GET', '/foo/123/bar');

    res[0][0](res[0][1]);
  }),
  add('find-my-way', () => {
    route.lookup({ method: 'GET', url: '/foo/123/bar' }, {});
  }),
  cycle(),
  complete()
);

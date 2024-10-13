import { add, complete, cycle, suite } from 'benny';
import FindMyWay from 'find-my-way';
import { RegExpRouter } from 'hono/router/reg-exp-router';
import { TrieRouter } from 'hono/router/trie-router';
import { CallbackNode, RootNode } from './nodes.js';

const root = new RootNode('/');
const foo = new CallbackNode('GET', () => ({ foo: '1' }), 'foo');

root.push(foo);
root.optimize(['method', 'callback']);

const route = FindMyWay({
  defaultRoute() {
    return false;
  }
});
route.on('GET', '/foo', () => () => {
  //
});

const honoRouteRegEx = new RegExpRouter();
honoRouteRegEx.add('GET', '/foo', () => {
  //
});
const honoTrieRoute = new TrieRouter();
honoTrieRoute.add('GET', '/foo', () => {
  //
});

suite(
  'match static',
  add('node tree match', () => {
    root.match('/foo');
  }),
  add('hono regex match', () => {
    honoRouteRegEx.match('GET', '/foo');
  }),
  add('hono trie match', () => {
    honoTrieRoute.match('GET', '/foo');
  }),
  add('find-my-way', () => {
    route.find('GET', '/foo');
  }),
  cycle(),
  complete()
);

suite(
  'parse static',
  add('node tree parse', () => {
    root.parse('/foo');
  }),
  add('hono regex parse', () => {
    const [res] = honoRouteRegEx.match('GET', '/foo');

    const params = res[0][1];
  }),
  add('hono trie match', () => {
    const [res] = honoTrieRoute.match('GET', '/foo');

    const params = res[0][1];
  }),
  add('find-my-way', () => {
    route.find('GET', '/foo');
  }),
  cycle(),
  complete()
);

suite(
  'lookup static',
  add('node tree lookup', () => {
    root.lookup('GET', '/foo');
  }),
  add('hono regex lookup', () => {
    const [res] = honoRouteRegEx.match('GET', '/foo');
    const [callback, params] = res[0];

    callback(params);
  }),
  add('hono trie lookup', () => {
    const [res] = honoTrieRoute.match('GET', '/foo');
    const [callback, params] = res[0];

    callback(params);
  }),
  add('find-my-way', () => {
    route.lookup({ method: 'GET', url: '/foo' }, {});
  }),
  cycle(),
  complete()
);

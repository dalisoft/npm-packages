import Extreme, { param, wildcard } from 'extreme-router';
import { Node } from 'fast-node-parse';
import fppParseA from 'fast-path-parse/aot/parse';
import fppParseR from 'fast-path-parse/runtime/parse';
import FindMyWay from 'find-my-way';
import { RegExpRouter } from 'hono/router/reg-exp-router';
import { TrieRouter } from 'hono/router/trie-router';
import { bench, describe } from 'vitest';
import { CallbackNode, RootNode } from '../../nodes.js';
import { Wired } from '../../wired.js';
import { config, handler } from '../config.js';

const { path, complexity, validate } = {
  complexity: 'easy',
  path: '/foo/:id',
  validate: '/foo/bar'
};

// Initialization
const extreme = new Extreme();
const honoRouteRegEx = new RegExpRouter();
const honoTrieRoute = new TrieRouter();
const wire = new Wired();

// Registering necessary modules
extreme.use(param).use(wildcard);

// fast-node-parse init
const root = new RootNode('/');
const foo = new Node('foo');
const id = new CallbackNode('GET', handler, path.substring(1));

// Registering routes
foo.push(id);
root.push(foo);
root.optimize(['method', 'callback']);

const fastPathParseParseRuntime = fppParseR(path);
const fastPathParseParseAoT = fppParseA(path);

const route = FindMyWay({
  defaultRoute() {
    return false;
  }
});
route.on('GET', path, () => handler);
honoRouteRegEx.add('GET', path, handler);
honoTrieRoute.add('GET', path, handler);
wire.add('GET', path, handler);
extreme.register('/foo').handler = handler;

// Suite
describe(`parse [${complexity}]`, () => {
  bench('fast-node-parse', () => root.parse(validate), config);
  bench(
    'fast-path-parse[-runtime]',
    () => fastPathParseParseRuntime(validate),
    config
  );
  bench('fast-path-parse[-aot]', () => fastPathParseParseAoT(validate), config);
  bench(
    'hono-regex-match',
    () => {
      const [res] = honoRouteRegEx.match('GET', validate);
      const params = res[0][1];

      return params;
    },
    config
  );
  bench(
    'hono-trie-match',
    () => {
      const [res] = honoTrieRoute.match('GET', validate);
      const params = res[0][1];

      return params;
    },
    config
  );
  bench('find-my-way', () => route.find('GET', validate), config);
  bench('extreme-router', () => extreme.match(validate).params, config);
});

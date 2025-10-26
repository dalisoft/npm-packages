import Extreme, { param, wildcard } from 'extreme-router';
import FindMyWay from 'find-my-way';
import { RegExpRouter } from 'hono/router/reg-exp-router';
import { TrieRouter } from 'hono/router/trie-router';
import { bench, describe } from 'vitest';
import { CallbackNode, RootNode } from '../../nodes.js';
import { Wired } from '../../wired.js';
import { config, handler } from '../config.js';

const { path, complexity, validate } = {
  path: '/foo',
  complexity: 'zero',
  validate: '/foo'
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
const foo = new CallbackNode('GET', handler, path.substring(1));

// Registering routes
root.push(foo);
root.optimize(['method', 'callback']);

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
describe(`lookup [${complexity}]`, () => {
  bench('fast-node-parse', () => root.lookup(validate), config);
  bench(
    'hono-regex-match',
    () => {
      const [res] = honoRouteRegEx.match('GET', validate);
      const [callback, params] = res[0];

      return callback(params);
    },
    config
  );
  bench(
    'hono-trie-match',
    () => {
      const [res] = honoTrieRoute.match('GET', validate);
      const [callback, params] = res[0];

      return callback(params);
    },
    config
  );
  bench(
    'find-my-way',
    () => route.lookup({ method: 'GET', url: validate }, {}),
    config
  );
  bench('wired', () => wire.lookup('GET', validate)(), config);
  bench(
    'extreme-router',
    () => {
      const { handler: routeHandler, params } = extreme.match(validate);

      return routeHandler(params);
    },
    config
  );
});

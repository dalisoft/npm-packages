import Extreme, { param, wildcard } from 'extreme-router';
import { Node, Router } from 'fast-node-parse';
import fppParseA from 'fast-path-parse/aot/parse';
import fppParseR from 'fast-path-parse/runtime/parse';
import FindMyWay from 'find-my-way';
import { RegExpRouter } from 'hono/router/reg-exp-router';
import { TrieRouter } from 'hono/router/trie-router';
import { bench, describe } from 'vitest';
import { FastTree } from '../../fast-tree.ts';
import { CallbackNode, RootNode } from '../../nodes.js';
import { Wired } from '../../wired.js';
import { config, handler } from '../config.js';

const { path, complexity, validate } = {
  complexity: 'medium',
  path: '/foo/:id/:kind',
  validate: '/foo/1234/weather'
};

// Initialization
const extreme = new Extreme();
const honoRouteRegEx = new RegExpRouter();
const honoTrieRoute = new TrieRouter();
const wire = new Wired();
const fastTree = new FastTree();
const router = new Router();

// Registering necessary modules
extreme.use(param).use(wildcard);

// fast-node-parse init
const root = new RootNode('/');
const id = new Node(':id');
const kind = new CallbackNode('GET', handler, ':kind');

// Registering routes
id.push(kind);
root.push(id);
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
extreme.register(path).handler = handler;
fastTree.insert('GET', path, { descriptor: () => handler() });
router.insert('GET', path, { descriptor: () => handler() });
const routerBound = router.bind('GET', { normalize: 'raw' });
const routerParams = {};

// Suite
describe(`parse [${complexity}]`, () => {
  bench('fast-tree', () => fastTree.parse('GET', validate), config);
  bench('fast-node-parse', () => root.parse(validate), config);
  bench(
    'fast-node-router',
    () => routerBound.parse(validate, routerParams),
    config
  );
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
  bench('extreme-router', () => extreme.match(validate)?.params, config);
});

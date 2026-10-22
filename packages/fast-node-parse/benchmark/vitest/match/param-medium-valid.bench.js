import Extreme, { param, wildcard } from 'extreme-router';
import { Node } from 'fast-node-parse';
import fppMatchA from 'fast-path-parse/aot/match';
import fppMatchR from 'fast-path-parse/runtime/match';
import FindMyWay from 'find-my-way';
import { RegExpRouter } from 'hono/router/reg-exp-router';
import { TrieRouter } from 'hono/router/trie-router';
import { bench, describe } from 'vitest';
import { CallbackNode, RootNode } from '../../nodes.js';
import { Wired } from '../../wired.js';
import { config, handler } from '../config.js';

const { path, complexity, validate } = {
  complexity: 'medium',
  path: '/user/:id/edit/:page',
  validate: '/user/1234/edit/weather'
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
const id = new Node(':id');
const edit = new Node('edit');
const page = new CallbackNode('GET', handler, ':page');

// Registering routes
edit.push(page);
id.push(edit);
root.push(id);
root.optimize(['method', 'callback']);

const fastPathParseMatchRuntime = fppMatchR(path);
const fastPathParseMatchAoT = fppMatchA(path);

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

describe(`matching [${complexity}]`, () => {
  bench('fast-node-parse', () => root.match(validate), config);
  bench(
    'fast-path-parse[-runtime]',
    () => fastPathParseMatchRuntime(validate),
    config
  );
  bench('fast-path-parse[-aot]', () => fastPathParseMatchAoT(validate), config);
  bench(
    'hono-regex-match',
    () => honoRouteRegEx.match('GET', validate),
    config
  );
  bench('hono-trie-match', () => honoTrieRoute.match('GET', validate), config);
  bench('find-my-way', () => route.find('GET', validate), config);
  bench('wired', () => wire.has('GET', validate), config);
  bench('extreme-router', () => extreme.match(validate), config);
});

import Extreme, { param, wildcard } from 'extreme-router';
import fppMatchA from 'fast-path-parse/aot/match';
import fppMatchR from 'fast-path-parse/runtime/match';
import FindMyWay from 'find-my-way';
import { RegExpRouter } from 'hono/router/reg-exp-router';
import { TrieRouter } from 'hono/router/trie-router';
import { bench, describe } from 'vitest';
import { Node as BeforeNode } from '../../.backup/src/node.js';
import { Node as AfterNode } from '../../src/node.js';
import { FastTree } from '../fast-tree.ts';
import { config, handler } from './config.js';

const createCallbackNode = (NodeClass) =>
  class CallbackNode extends NodeClass {
    constructor(method, callback, segment) {
      super(segment);

      this.method = method;
      this.callback = callback;
    }
  };

const createRootNode = (NodeClass) =>
  class RootNode extends NodeClass {
    lookup(method, path) {
      const result = super.lookup(path);

      if (!result || result.method !== method) {
        return false;
      }

      return result.callback(this.parse(path) || {});
    }
  };

const createNodeRoute = (NodeClass, path) => {
  const RootNode = createRootNode(NodeClass);
  const CallbackNode = createCallbackNode(NodeClass);
  const root = new RootNode('/');
  const parts = path.split('/').slice(1);
  let parent = root;

  for (let i = 0; i < parts.length; i++) {
    const NodeCtor = i === parts.length - 1 ? CallbackNode : NodeClass;
    const node =
      i === parts.length - 1
        ? new NodeCtor('GET', handler, parts[i])
        : new NodeCtor(parts[i]);

    parent.push(node);
    parent = node;
  }

  return root;
};

const createLegacyNodeRoute = (NodeClass, path) => {
  const RootNode = createRootNode(NodeClass);
  const CallbackNode = createCallbackNode(NodeClass);
  const root = new RootNode('/');

  root.push(new CallbackNode('GET', handler, path.substring(1)));

  return root;
};

const createCompetitors = (path) => {
  const fastTree = new FastTree();
  const honoRouteRegEx = new RegExpRouter();
  const honoTrieRoute = new TrieRouter();
  const route = FindMyWay({
    defaultRoute() {
      return false;
    }
  });
  const extreme = new Extreme();

  extreme.use(param).use(wildcard);
  fastTree.insert('GET', path, { descriptor: () => handler() });
  honoRouteRegEx.add('GET', path, handler);
  honoTrieRoute.add('GET', path, handler);
  route.on('GET', path, () => handler);
  extreme.register(path).handler = handler;

  return {
    extreme,
    fastPathParseMatchAoT: fppMatchA(path),
    fastPathParseMatchRuntime: fppMatchR(path),
    fastTree,
    honoRouteRegEx,
    honoTrieRoute,
    route
  };
};

const staticCase = {
  name: 'static-zero',
  path: '/foo',
  validate: '/foo'
};

const paramCase = {
  name: 'param-easy',
  path: '/foo/:id',
  validate: '/foo/bar'
};

const paramMediumCase = {
  name: 'param-medium',
  path: '/foo/:id/:kind',
  validate: '/foo/123/bar'
};

for (const current of [staticCase, paramCase, paramMediumCase]) {
  const before =
    current.before === 'legacy'
      ? createLegacyNodeRoute(BeforeNode, current.path)
      : createNodeRoute(BeforeNode, current.path);
  const after =
    current.after === 'legacy'
      ? createLegacyNodeRoute(AfterNode, current.path)
      : createNodeRoute(AfterNode, current.path);
  const competitors = createCompetitors(current.path);

  describe(`node before/after match [${current.name}]`, () => {
    bench(
      'fast-node-parse-before',
      () => before.match(current.validate),
      config
    );
    bench('fast-node-parse-after', () => after.match(current.validate), config);
    bench(
      'fast-tree',
      () => competitors.fastTree.match('GET', current.validate),
      config
    );
    bench(
      'fast-path-parse[-runtime]',
      () => competitors.fastPathParseMatchRuntime(current.validate),
      config
    );
    bench(
      'fast-path-parse[-aot]',
      () => competitors.fastPathParseMatchAoT(current.validate),
      config
    );
    bench(
      'hono-regex-match',
      () => competitors.honoRouteRegEx.match('GET', current.validate),
      config
    );
    bench(
      'hono-trie-match',
      () => competitors.honoTrieRoute.match('GET', current.validate),
      config
    );
    bench(
      'find-my-way',
      () => competitors.route.find('GET', current.validate),
      config
    );
    bench(
      'extreme-router',
      () => competitors.extreme.match(current.validate),
      config
    );
  });

  describe(`node before/after parse [${current.name}]`, () => {
    bench(
      'fast-node-parse-before',
      () => before.parse(current.validate),
      config
    );
    bench('fast-node-parse-after', () => after.parse(current.validate), config);
    bench(
      'fast-tree',
      () => competitors.fastTree.parse('GET', current.validate),
      config
    );
    bench(
      'hono-regex-match',
      () => competitors.honoRouteRegEx.match('GET', current.validate),
      config
    );
    bench(
      'hono-trie-match',
      () => competitors.honoTrieRoute.match('GET', current.validate),
      config
    );
    bench(
      'extreme-router',
      () => competitors.extreme.match(current.validate)?.params,
      config
    );
  });

  describe(`node before/after lookup [${current.name}]`, () => {
    bench(
      'fast-node-parse-before',
      () => before.lookup('GET', current.validate),
      config
    );
    bench(
      'fast-node-parse-after',
      () => after.lookup('GET', current.validate),
      config
    );
    bench(
      'fast-tree',
      () => competitors.fastTree.lookup('GET', current.validate),
      config
    );
    bench(
      'hono-regex-match',
      () => {
        const [res] = competitors.honoRouteRegEx.match('GET', current.validate);
        const [callback, params] = res[0];

        return callback(params);
      },
      config
    );
    bench(
      'hono-trie-match',
      () => {
        const [res] = competitors.honoTrieRoute.match('GET', current.validate);
        const [callback, params] = res[0];

        return callback(params);
      },
      config
    );
    bench(
      'find-my-way',
      () =>
        competitors.route.lookup({ method: 'GET', url: current.validate }, {}),
      config
    );
    bench(
      'extreme-router',
      () => {
        const { handler: routeHandler, params } = competitors.extreme.match(
          current.validate
        );

        return routeHandler(params);
      },
      config
    );
  });
}

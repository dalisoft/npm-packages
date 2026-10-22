// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable max-lines */

import Extreme, { param, wildcard } from 'extreme-router';
import fppMatchA from 'fast-path-parse/aot/match';
import fppParseA from 'fast-path-parse/aot/parse';
import fppMatchR from 'fast-path-parse/runtime/match';
import fppParseR from 'fast-path-parse/runtime/parse';
import FindMyWay from 'find-my-way';
import { RegExpRouter } from 'hono/router/reg-exp-router';
import { TrieRouter } from 'hono/router/trie-router';
import { bench, describe } from 'vitest';
import { CallbackNode, RootNode } from './nodes.js';
import { Wired } from './wired.js';

/**
 * DO NOT TOUCH
 * THIS IS TESTING CONSTANT
 */
/** @type {import('vitest').BenchOptions} */
const globalBenchConfig = {
  iterations: 1_000_000,
  now: process.now,
  warmupIterations: 1_000
};

const modes = [
  {
    complexity: 'zero',
    path: '/foo',
    validate: '/foo'
  },
  {
    complexity: 'zero',
    path: '/foo/bar',
    validate: '/foo/bar'
  },
  {
    complexity: 'easy',
    path: '/foo/:bar',
    validate: '/foo/bar'
  },
  {
    complexity: 'easy',
    path: '/foo/*',
    validate: '/foo/bar'
  },
  {
    complexity: 'medium',
    path: '/user/:id/edit/:page',
    validate: '/user/1234/edit/weather'
  }
];

for (const { path, complexity, validate } of modes) {
  const root = new RootNode('/');
  const foo = new CallbackNode(
    'GET',
    () => {
      return 1 + (1 * 2) / 2 + 1;
    },
    'foo'
  );
  const fastPathParseMatchRuntime = fppMatchR(path);
  const fastPathParseMatchAoT = fppMatchA(path);
  const fastPathParseParseRuntime = fppParseR(path);
  const fastPathParseParseAoT = fppParseA(path);
  const wire = new Wired();
  const extreme = new Extreme();

  extreme.use(param).use(wildcard);

  root.push(foo);
  root.optimize(['method', 'callback']);

  const route = FindMyWay({
    defaultRoute() {
      return false;
    }
  });
  route.on('GET', path, () => () => {
    return 1 + (1 * 2) / 2 + 1;
  });

  const honoRouteRegEx = new RegExpRouter();
  honoRouteRegEx.add('GET', path, () => {
    return 1 + (1 * 2) / 2 + 1;
  });
  const honoTrieRoute = new TrieRouter();
  honoTrieRoute.add('GET', path, () => {
    return 1 + (1 * 2) / 2 + 1;
  });

  wire.add('GET', path, () => {
    return 1 + (1 * 2) / 2 + 1;
  });

  extreme.register('/foo').handler = () => {
    return 1 + (1 * 2) / 2 + 1;
  };

  describe(`matching [${complexity}]`, () => {
    bench(
      'fast-node-parse',
      () => {
        return root.match(validate);
      },
      globalBenchConfig
    );
    bench(
      'fast-path-parse[-runtime]',
      () => {
        return fastPathParseMatchRuntime(validate);
      },
      globalBenchConfig
    );
    bench(
      'fast-path-parse[-aot]',
      () => {
        return fastPathParseMatchAoT(validate);
      },
      globalBenchConfig
    );
    bench(
      'hono-regex-match',
      () => {
        return honoRouteRegEx.match('GET', validate);
      },
      globalBenchConfig
    );
    bench(
      'hono-trie-match',
      () => {
        return honoTrieRoute.match('GET', validate);
      },
      globalBenchConfig
    );
    bench(
      'find-my-way',
      () => {
        return route.find('GET', validate);
      },
      globalBenchConfig
    );
    bench(
      'wired',
      () => {
        return wire.has('GET', validate);
      },
      globalBenchConfig
    );
    bench(
      'extreme-router',
      () => {
        return extreme.match(validate);
      },
      globalBenchConfig
    );
  });

  // Suite
  describe(`parse [${complexity}]`, () => {
    bench(
      'fast-node-parse',
      () => {
        return root.parse(validate);
      },
      globalBenchConfig
    );
    bench(
      'fast-path-parse[-runtime]',
      () => {
        return fastPathParseParseRuntime(validate);
      },
      globalBenchConfig
    );
    bench(
      'fast-path-parse[-aot]',
      () => {
        return fastPathParseParseAoT(validate);
      },
      globalBenchConfig
    );
    bench(
      'hono-regex-match',
      () => {
        const [res] = honoRouteRegEx.match('GET', validate);
        const params = res[0][1];

        return params;
      },
      globalBenchConfig
    );
    bench(
      'hono-trie-match',
      () => {
        const [res] = honoTrieRoute.match('GET', validate);
        const params = res[0][1];

        return params;
      },
      globalBenchConfig
    );
    bench(
      'find-my-way',
      () => {
        return route.find('GET', validate);
      },
      globalBenchConfig
    );
    bench(
      'extreme-router',
      () => {
        return extreme.match(validate).params;
      },
      globalBenchConfig
    );
  });

  // Suite
  describe(`lookup [${complexity}]`, () => {
    bench(
      'fast-node-parse',
      () => {
        return root.lookup(validate);
      },
      globalBenchConfig
    );
    bench(
      'hono-regex-match',
      () => {
        const [res] = honoRouteRegEx.match('GET', validate);
        const [callback, params] = res[0];

        return callback(params);
      },
      globalBenchConfig
    );
    bench(
      'hono-trie-match',
      () => {
        const [res] = honoTrieRoute.match('GET', validate);
        const [callback, params] = res[0];

        return callback(params);
      },
      globalBenchConfig
    );
    bench(
      'find-my-way',
      () => {
        return route.lookup({ method: 'GET', url: validate }, {});
      },
      globalBenchConfig
    );
    bench(
      'wired',
      () => {
        return wire.lookup('GET', validate)();
      },
      globalBenchConfig
    );
    bench(
      'extreme-router',
      () => {
        const { handler, params } = extreme.match(validate);

        return handler(params);
      },
      globalBenchConfig
    );
  });
}

// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable max-lines */

import Extreme, { param, wildcard } from 'extreme-router';
import fppMatchA from 'fast-path-parse/aot/match';
import fppParseA from 'fast-path-parse/aot/parse';
import fppMatchR from 'fast-path-parse/runtime/match';
import fppParseR from 'fast-path-parse/runtime/parse';
import FindMyWay from 'find-my-way';
import { RegExpRouter } from 'hono/router/reg-exp-router';
import { SmartRouter } from 'hono/router/smart-router';
import { TrieRouter } from 'hono/router/trie-router';
import { bench, describe } from 'vitest';
import { MixedTree, NodeTree } from '../src/node-vtree-2';
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
  throws: true,
  warmupIterations: 1
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
    path: '/foo/:id',
    validate: '/foo/123'
  },
  {
    complexity: 'easy',
    path: '/foo/*',
    validate: '/foo/wildcard'
  },
  {
    complexity: 'medium',
    path: '/user/:id/edit/:page',
    validate: '/user/1234/edit/weather'
  }
];

const wire = new Wired();

const extreme = new Extreme({
  allowRegisterUpdateExisting: true,
  skipPluginValidation: true
});
extreme.use(param).use(wildcard);

const nodetree = new NodeTree();
const mixedtree = new MixedTree();

const root = new RootNode('/');
const foo = new CallbackNode(
  'GET',
  () => {
    return 1 + (1 * 2) / 2 + 1;
  },
  'foo'
);

root.push(foo);
root.optimize(['method', 'callback']);

const route = FindMyWay({
  defaultRoute() {
    return false;
  }
});

const honoSmartRoute = new SmartRouter({
  routers: [new RegExpRouter(), new TrieRouter()]
});
const honoTrieRoute = new TrieRouter();
const makeHonoStoredHandler = (method, path, fn) => {
  return fn;
};

for (const { path, complexity, validate } of modes) {
  const fastPathParseMatchRuntime = fppMatchR(path);
  const fastPathParseMatchAoT = fppMatchA(path);
  const fastPathParseParseRuntime = fppParseR(path);
  const fastPathParseParseAoT = fppParseA(path);

  const callback = () => {
    return 1 + (1 * 2) / 2 + 1;
  };

  nodetree.insert(path, callback);
  mixedtree.insert(path, callback);
  route.on('GET', path, () => callback);
  honoSmartRoute.add('GET', path, makeHonoStoredHandler('GET', path, callback));
  honoTrieRoute.add('GET', path, makeHonoStoredHandler('GET', path, callback));
  wire.add('GET', path, callback);
  extreme.register(path).handler = callback;

  describe(`initialize [${complexity}]`, () => {
    bench('fast-node-parse:beta', () => {
      new NodeTree().insert(path, callback);
    });
    bench('fast-node-parse:beta [mixed]', () => {
      new MixedTree().insert(path, callback);
    });
    bench('find-my-way', () => {
      FindMyWay({
        defaultRoute() {
          return false;
        }
      }).on('GET', path, () => callback);
    });
    bench('hono-smart-match', () => {
      new SmartRouter({
        routers: [new RegExpRouter(), new TrieRouter()]
      }).add('GET', path, makeHonoStoredHandler('GET', path, callback));
    });
    bench('hono-regex-match', () => {
      new RegExpRouter().add(
        'GET',
        path,
        makeHonoStoredHandler('GET', path, callback)
      );
    });
    bench('hono-trie-match', () => {
      new TrieRouter().add(
        'GET',
        path,
        makeHonoStoredHandler('GET', path, callback)
      );
    });
    /* bench('wired', () => {
      new Wired().add('GET', path, callback);
    }); */
    bench('extreme-router', () => {
      new Extreme({
        allowRegisterUpdateExisting: true,
        skipPluginValidation: true
      })
        .use(param)
        .use(wildcard)
        .register(path).handler = callback;
    });
  });

  describe(`matching [${complexity}]`, () => {
    /* bench(
      'fast-node-parse',
      () => {
        return root.match(validate);
      },
      globalBenchConfig
    ); */
    bench(
      'fast-node-parse:beta',
      () => {
        return nodetree.match(validate);
      },
      globalBenchConfig
    );
    bench(
      'fast-node-parse:beta [mixed]',
      () => {
        return mixedtree.match(validate);
      },
      globalBenchConfig
    );
    /* bench(
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
    ); */
    bench(
      'hono-smart-match',
      () => {
        return honoSmartRoute.match('GET', validate);
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
    ); /*
    bench(
      'wired',
      () => {
        return wire.has('GET', validate);
      },
      globalBenchConfig
    );*/
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
    /* bench(
      'fast-node-parse',
      () => {
        return root.parse(validate);
      },
      globalBenchConfig
    ); */
    bench(
      'fast-node-parse:beta',
      () => {
        return nodetree.parse(validate);
      },
      globalBenchConfig
    );
    bench(
      'fast-node-parse:beta [mixed]',
      () => {
        return mixedtree.parse(validate);
      },
      globalBenchConfig
    );
    /*bench(
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
    );*/
    bench(
      'hono-smart-match',
      () => {
        const [res] = honoSmartRoute.match('GET', validate);
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
        return extreme.match(validate)?.params;
      },
      globalBenchConfig
    );
  });

  // Suite
  describe(`lookup [${complexity}]`, () => {
    /* bench(
      'fast-node-parse',
      () => {
        return root.lookup(validate);
      },
      globalBenchConfig
    ); */
    bench(
      'fast-node-parse:beta',
      () => {
        return nodetree.lookup(validate);
      },
      globalBenchConfig
    );
    bench(
      'fast-node-parse:beta [mixed]',
      () => {
        return mixedtree.lookup(validate);
      },
      globalBenchConfig
    );
    bench(
      'hono-smart-match',
      () => {
        const [res] = honoSmartRoute.match('GET', validate);
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
    /* bench(
      'wired',
      () => {
        return wire.lookup('GET', validate)?.();
      },
      globalBenchConfig
    ); */
    bench(
      'extreme-router',
      () => {
        const ematch = extreme.match(validate);

        return ematch?.handler(ematch?.params);
      },
      globalBenchConfig
    );
  });
}

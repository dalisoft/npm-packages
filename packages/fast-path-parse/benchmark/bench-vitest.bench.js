/* eslint-disable max-lines */

import Extreme, { param, wildcard } from 'extreme-router';
import { match as pathToRegExpMatch } from 'path-to-regexp';
import pathToTree from 'path-to-tree';
import { bench, describe } from 'vitest';
import fastPathMatchCompile from '../src/aot/match.js';
import fastPathParseCompile from '../src/aot/parse.js';
import fastPathMatch from '../src/runtime/match.js';
import fastPathParse from '../src/runtime/parse.js';

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
  const aotMatch = fastPathMatchCompile(path);
  const aotMatchCompact = fastPathMatchCompile(path, true);
  const runtimeMatch = fastPathMatch(path);
  const runtimeMatchCompact = fastPathMatch(path, true);
  const $pathToRegExpMatch = pathToRegExpMatch(path);
  const extreme = new Extreme();

  extreme.use(param).use(wildcard);

  extreme.register(path).handler = true;

  describe(`matching [${complexity}]`, () => {
    bench(
      'path-to-regexp',
      () => {
        return $pathToRegExpMatch(validate);
      },
      globalBenchConfig
    );
    bench(
      'fast-path-parse[-aot]',
      () => {
        aotMatch(validate);
      },
      globalBenchConfig
    );
    bench(
      'fast-path-parse[-aot]-compact',
      () => {
        aotMatchCompact(validate);
      },
      globalBenchConfig
    );
    bench(
      'fast-path-parse[-runtime]',
      () => {
        runtimeMatch(validate);
      },
      globalBenchConfig
    );
    bench(
      'fast-path-parse[-runtime]-compact',
      () => {
        runtimeMatchCompact(validate);
      },
      globalBenchConfig
    );
    bench(
      'extreme-router',
      () => {
        extreme.match(validate);
      },
      globalBenchConfig
    );
  });

  const aotParse = fastPathParseCompile(path);
  const aotParseCompact = fastPathParseCompile(path, true);
  const runtimeParse = fastPathParse(path);
  const runtimeParseCompact = fastPathParse(path, true);
  const $pathToRegExpParse = pathToRegExpMatch(path);
  const tree = pathToTree();
  tree.add(path, 2);

  // Suite
  describe(`parse [${complexity}]`, () => {
    bench(
      'path-to-regexp',
      () => {
        $pathToRegExpParse(validate);
      },
      globalBenchConfig
    );
    bench(
      'fast-path-parse[-aot]',
      () => {
        aotParse(validate);
      },
      globalBenchConfig
    );
    bench(
      'fast-path-parse[-aot]-compact',
      () => {
        aotParseCompact(validate);
      },
      globalBenchConfig
    );
    bench(
      'fast-path-parse[-runtime]',
      () => {
        runtimeParse(validate);
      },
      globalBenchConfig
    );
    bench(
      'fast-path-parse[-runtime]-compact',
      () => {
        runtimeParseCompact(validate);
      },
      globalBenchConfig
    );
    bench(
      'path-to-tree',
      () => {
        tree.find(validate);
      },
      globalBenchConfig
    );
    bench(
      'extreme-router',
      () => {
        const { params } = extreme.match(validate);
      },
      globalBenchConfig
    );
  });
}

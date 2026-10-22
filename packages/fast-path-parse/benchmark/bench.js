import { add, complete, cycle, suite } from 'benny';
import { match as pathToRegExpMatch } from 'path-to-regexp';
import pathToTree from 'path-to-tree';
import fastPathMatchCompile from '../src/aot/match.js';
import fastPathParseCompile from '../src/aot/parse.js';
import fastPathMatch from '../src/runtime/match.js';
import fastPathParse from '../src/runtime/parse.js';

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
  const runtimeMatch = fastPathMatch(path);
  const $pathToRegExpMatch = pathToRegExpMatch(path);

  // Suite
  suite(
    `matching [${complexity}]`,
    add('path-to-regexp', () => {
      return $pathToRegExpMatch(validate);
    }),
    add('fast-path-parse[-aot]', () => {
      aotMatch(validate);
    }),
    add('fast-path-parse[-runtime]', () => {
      runtimeMatch(validate);
    }),
    cycle(),
    complete()
  );

  const aotParse = fastPathParseCompile(path);
  const runtimeParse = fastPathParse(path);
  const $pathToRegExpParse = pathToRegExpMatch(path);
  const tree = pathToTree();
  tree.add(path, 2);

  // Suite
  suite(
    `parse [${complexity}]`,
    add('path-to-regexp', () => {
      $pathToRegExpParse(validate);
    }),
    add('fast-path-parse[-aot]', () => {
      aotParse(validate);
    }),
    add('fast-path-parse[-runtime]', () => {
      runtimeParse(validate);
    }),
    add('path-to-tree', () => {
      tree.find(validate);
    }),
    cycle(),
    complete()
  );
}

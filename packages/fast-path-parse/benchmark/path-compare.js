import { match } from 'path-to-regexp';
import { add, complete, cycle, suite } from 'tinybench';
import fastPathCompile from '../src/aot/match.js';
import fastPathParse from '../src/runtime/match.js';

const pathString = '/foo/:bar';

const aotMatch = fastPathCompile(pathString);
const runtimeMatch = fastPathParse(pathString);
const $match = match(pathString);

// Suite
suite(
  'path-compare',
  add('string-compare', () => {
    return $match('/foo/bar');
  }),
  add('aot-match', () => {
    aotMatch('/foo/bar');
  }),
  add('runtime-match', () => {
    runtimeMatch('/foo/bar');
  }),
  cycle(),
  complete()
);

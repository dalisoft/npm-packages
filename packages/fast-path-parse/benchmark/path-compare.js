import benny from 'benny';
import fastPathCompile from 'fast-path-parse/aot/match';
import fastPathParse from 'fast-path-parse/runtime/match';
import { match } from 'path-to-regexp';

const pathString = '/foo/:bar';

const aotMatch = fastPathCompile(pathString);
const runtimeMatch = fastPathParse(pathString);
const $match = match(pathString);

// Suite
benny.suite(
  'path-compare',
  benny.add('string-compare', () => {
    return $match('/foo/bar');
  }),
  benny.add('aot-match', () => {
    aotMatch('/foo/bar');
  }),
  benny.add('runtime-match', () => {
    runtimeMatch('/foo/bar');
  }),
  benny.cycle(),
  benny.complete()
);

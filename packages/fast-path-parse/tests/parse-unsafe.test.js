import { describe } from 'node:test';
import compilePathname from '../src/aot/parse.js';
import testsParseData from './data/parse.js';
import testsParseSecurityData from './data/parse.js';
import { runTest } from './helpers.js';

describe('fast-path-parse/parse unsafe', () => {
  for (const test of testsParseData) {
    runTest(test, (input, output) => compilePathname(input)(output));
  }
});

describe('fast-path-parse/parse unsafe security', () => {
  for (const test of testsParseSecurityData) {
    runTest(test, (input, output) => compilePathname(input)(output));
  }
});

import { describe } from 'vitest';
import parsePathname from '../src/runtime/parse.js';
import testsParseData from './data/parse.js';
import testsParseSecurityData from './data/parse.security.js';
import { runTest } from './helpers.js';

describe('fast-path-parse/parse safe', () => {
  for (const test of testsParseData) {
    runTest(test, (input, output) => parsePathname(input)(output));
  }
});

describe('fast-path-parse/parse security', () => {
  for (const test of testsParseSecurityData) {
    runTest(test, (input, output) => parsePathname(input)(output));
  }
});

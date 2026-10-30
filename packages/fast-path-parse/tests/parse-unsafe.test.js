import { describe } from 'node:test';
import compilePathname from '../src/aot/parse.js';
import testsParseData from './data/parse.js';
import testsParseSecurityData from './data/parse.security.js';
import { generateTest, runTest } from './helpers.ts';

const callee = (prepare, input, args) =>
  compilePathname(prepare, ...args)(input);

describe('fast-path-parse/parse unsafe', () => {
  for (const test of testsParseData) {
    runTest(generateTest(test), callee);
  }
});

describe('fast-path-parse/parse unsafe security', () => {
  for (const test of testsParseSecurityData) {
    runTest(generateTest(test), callee);
  }
});

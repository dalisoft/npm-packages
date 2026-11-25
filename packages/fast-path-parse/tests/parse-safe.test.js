import { describe } from 'node:test';
import parsePathname from '../src/runtime/parse.js';
import testsParseData from './data/parse.js';
import testsParseSecurityData from './data/parse.security.js';
import { generateTest, runTest } from './helpers.ts';

const callee = (prepare, input, args) => parsePathname(prepare, ...args)(input);

describe('fast-path-parse/parse safe', () => {
  for (const test of testsParseData) {
    runTest(generateTest(test), callee);
  }
});

describe('fast-path-parse/parse security', () => {
  for (const test of testsParseSecurityData) {
    runTest(generateTest(test), callee);
  }
});

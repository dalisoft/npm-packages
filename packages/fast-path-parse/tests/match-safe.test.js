import { describe } from 'node:test';
import match from '../src/runtime/match.js';
import testsMatchData from './data/match.js';
import testsMatchSecurityData from './data/match.security.js';
import { generateTest, runTest } from './helpers.ts';

const callee = (prepare, input, args) => match(prepare, ...args)(input);

describe('fast-path-parse/match safe', () => {
  for (const test of testsMatchData) {
    runTest(generateTest(test), callee);
  }
});

describe('fast-path-parse/match safe security', () => {
  for (const test of testsMatchSecurityData) {
    runTest(generateTest(test), callee);
  }
});

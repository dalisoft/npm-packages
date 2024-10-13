import { describe } from 'vitest';
import match from '../src/aot/match.js';
import testsMatchData from './data/match.js';
import testsMatchSecurityData from './data/match.security.js';
import { runTest } from './helpers.js';

describe('fast-path-parse/match unsafe', () => {
  for (const test of testsMatchData) {
    runTest(test, (input, output) => match(input)(output));
  }
});

describe('fast-path-parse/match unsafe security', () => {
  for (const test of testsMatchSecurityData) {
    runTest(test, (input, output) => match(input)(output));
  }
});

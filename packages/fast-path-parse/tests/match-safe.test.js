import { describe, it } from 'vitest';
import match from '../src/runtime/match.js';
import testsMatchData from './data/match.js';
import testsMatchSecurityData from './data/match.security.js';
import { generateTest } from './helpers';

function runTest({ suite, tests }) {
  describe(suite, () => {
    for (const test of tests) {
      if (test.args) {
        const { name, args, input_args, excepted } = test;
        const [prepare, input] = args;

        it(name, ({ expect }) => {
          expect(match(prepare, ...input_args)(input)).toStrictEqual(excepted);
        });
      } else {
        runTest(test);
      }
    }
  });
}

describe('fast-path-parse/match safe', () => {
  for (const testData of testsMatchData) {
    runTest(generateTest(testData));
  }
});

describe('fast-path-parse/match safe security', () => {
  for (const test of testsMatchSecurityData) {
    runTest(generateTest(test));
  }
});

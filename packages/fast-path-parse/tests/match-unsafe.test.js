import { describe, it } from 'vitest';
import match from '../src/aot/match.js';
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

describe('fast-path-parse/match unsafe', () => {
  for (const test of testsMatchData) {
    runTest(generateTest(test));
  }
});

describe('fast-path-parse/match unsafe security', () => {
  for (const test of testsMatchSecurityData) {
    runTest(generateTest(test));
  }
});

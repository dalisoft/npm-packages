import { describe, it } from 'vitest';
import compilePathname from '../src/aot/parse.js';
import testsParseData from './data/parse.js';
import testsParseSecurityData from './data/parse.security.js';
import { generateTest } from './helpers';

function runTest({ suite, tests }) {
  describe(suite, () => {
    for (const test of tests) {
      if (test.args) {
        const { name, args, input_args, excepted } = test;
        const [prepare, input] = args;

        it(name, ({ expect }) => {
          expect(compilePathname(prepare, ...input_args)(input)).toStrictEqual(
            excepted
          );
        });
      } else {
        runTest(test);
      }
    }
  });
}

describe('fast-path-parse/parse unsafe', () => {
  for (const test of testsParseData) {
    runTest(generateTest(test));
  }
});

describe('fast-path-parse/parse unsafe security', () => {
  for (const test of testsParseSecurityData) {
    runTest(generateTest(test));
  }
});

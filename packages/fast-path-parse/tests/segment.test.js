import { describe, it } from 'vitest';
import segmentsSlice from '../src/utils/segment.js';
import testsSegmentsData from './data/segments.js';
import { generateTest } from './helpers';

function runTest({ suite, tests }) {
  describe(suite, () => {
    for (const test of tests) {
      if (test.args) {
        const { name, args, excepted } = test;

        it(name, ({ expect }) => {
          expect(segmentsSlice(...args)).toStrictEqual(excepted);
        });
      } else {
        runTest(test);
      }
    }
  });
}

describe('segments slice', () => {
  for (const test of testsSegmentsData) {
    runTest(generateTest(test));
  }
});

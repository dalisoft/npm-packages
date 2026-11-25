import { describe } from 'node:test';
import segmentsSlice from '../src/utils/segment.js';
import testsSegmentsData from './data/segments.js';
import { generateTest, runTest } from './helpers.ts';

describe('segments slice', () => {
  for (const test of testsSegmentsData) {
    runTest(generateTest(test), (prepare, input) =>
      segmentsSlice(prepare, input)
    );
  }
});

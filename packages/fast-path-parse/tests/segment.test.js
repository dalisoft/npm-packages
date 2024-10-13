import { describe } from 'vitest';
import segmentsSlice from '../src/utils/segment.js';
import testsSegmentsData from './data/segments.js';
import { runTest } from './helpers.js';

describe('segments slice', () => {
  for (const test of testsSegmentsData) {
    runTest(test, (input, compact) => segmentsSlice(input, compact));
  }
});

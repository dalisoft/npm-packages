const { describe } = require('node:test');
const testsSegmentsData = require('./data/segments.js');
const segmentsSlice = require('../src/utils/segment.js');
const { runTest } = require('./helpers.js');

describe('segments slice', () => {
  for (const test of testsSegmentsData) {
    runTest(test, (input, compact) => segmentsSlice(input, compact));
  }
});

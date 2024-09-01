// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable max-lines-per-function */
const assert = require('node:assert');
const { describe, it } = require('node:test');
const segmentsSlice = require('../utils/segment.js');

describe('segments slice', async () => {
  await it('static route parse', () => {
    assert.deepStrictEqual(segmentsSlice('/foo/bar'), {
      filled: [],
      segments: [
        {
          name: 'foo',
          segment: false,
          last: false,
          position: 1
        },
        {
          name: 'bar',
          segment: false,
          last: true,
          position: 5
        }
      ],
      length: 2
    });
    assert.deepStrictEqual(segmentsSlice('/foo/bar/'), {
      filled: [],
      segments: [
        {
          name: 'foo',
          segment: false,
          last: false,
          position: 1
        },
        {
          name: 'bar',
          segment: false,
          last: true,
          position: 5
        }
      ],
      length: 2
    });
  });
  await it('simple dynamic route parse', () => {
    assert.deepStrictEqual(segmentsSlice('/foo/:id'), {
      filled: [
        {
          name: 'id',
          segment: true,
          last: true,
          position: 5
        }
      ],
      segments: [
        {
          name: 'foo',
          segment: false,
          last: false,
          position: 1
        },
        {
          name: 'id',
          segment: true,
          last: true,
          position: 5
        }
      ],
      length: 2
    });
    assert.deepStrictEqual(segmentsSlice('/foo/:id/'), {
      filled: [
        {
          name: 'id',
          segment: true,
          last: true,
          position: 5
        }
      ],
      segments: [
        {
          name: 'foo',
          segment: false,
          last: false,
          position: 1
        },
        {
          name: 'id',
          segment: true,
          last: true,
          position: 5
        }
      ],
      length: 2
    });
  });
});

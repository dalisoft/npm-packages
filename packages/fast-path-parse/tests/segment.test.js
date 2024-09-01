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
          segment: false
        },
        {
          name: 'bar',
          segment: false
        }
      ]
    });
    assert.deepStrictEqual(segmentsSlice('/foo/bar/'), {
      filled: [],
      segments: [
        {
          name: 'foo',
          segment: false
        },
        {
          name: 'bar',
          segment: false
        },
        {
          name: '',
          segment: false
        }
      ]
    });
  });
  await it('simple dynamic route parse', () => {
    assert.deepStrictEqual(segmentsSlice('/foo/:id'), {
      filled: [
        {
          name: 'id',
          segment: true
        }
      ],
      segments: [
        {
          name: 'foo',
          segment: false
        },
        {
          name: 'id',
          segment: true
        }
      ]
    });
    assert.deepStrictEqual(segmentsSlice('/foo/:id/'), {
      filled: [
        {
          name: 'id',
          segment: true
        }
      ],
      segments: [
        {
          name: 'foo',
          segment: false
        },
        {
          name: 'id',
          segment: true
        },
        {
          name: '',
          segment: false
        }
      ]
    });
  });
});

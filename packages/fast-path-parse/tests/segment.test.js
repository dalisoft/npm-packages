const assert = require('node:assert');
const { describe, it } = require('node:test');
const segmentsSlice = require('../utils/segment.js');

describe('segments slice', () => {
  describe('static route parse', () => {
    it('/foo/bar', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/bar'), {
        filled: [],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'bar',
            segment: false,
            last: true,
            position: 5,
            size: 3
          }
        ],
        length: 2
      });
    });
    it('/foo/bar/', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/bar/'), {
        filled: [],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'bar',
            segment: false,
            last: true,
            position: 5,
            size: 3
          }
        ],
        length: 2
      });
    });
  });

  describe('static route compact parse', () => {
    it('/foo/bar', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/bar', true), {
        filled: [],
        segments: [
          {
            name: 'foo/bar',
            segment: false,
            last: true,
            position: 1,
            size: 7
          }
        ],
        length: 1
      });
    });
    it('/foo/bar/', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/bar/', true), {
        filled: [],
        segments: [
          {
            name: 'foo/bar',
            segment: false,
            last: true,
            position: 1,
            size: 7
          }
        ],
        length: 1
      });
    });
  });

  describe('simple dynamic route parse, `:id`', () => {
    it('/foo/:id', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/:id'), {
        filled: [
          {
            name: 'id',
            segment: true,
            last: true,
            position: 5,
            size: 2
          }
        ],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'id',
            segment: true,
            last: true,
            position: 5,
            size: 2
          }
        ],
        length: 2
      });
    });
    it('/foo/:id/', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/:id/'), {
        filled: [
          {
            name: 'id',
            segment: true,
            last: true,
            position: 5,
            size: 2
          }
        ],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'id',
            segment: true,
            last: true,
            position: 5,
            size: 2
          }
        ],
        length: 2
      });
    });
  });

  describe('simple mixed route parse, `:id`', () => {
    it('/foo/:id/bar', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/:id/bar'), {
        filled: [
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          }
        ],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          },
          {
            name: 'bar',
            segment: false,
            last: true,
            position: 7,
            size: 3
          }
        ],
        length: 3
      });
    });
    it('/foo/:id/bar', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/:id/bar'), {
        filled: [
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          }
        ],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          },
          {
            name: 'bar',
            segment: false,
            last: true,
            position: 7,
            size: 3
          }
        ],
        length: 3
      });
    });
  });

  describe('simple static-mixed route parse, `:id`', () => {
    it('/foo/:id/bar/last', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/:id/bar/last'), {
        filled: [
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          }
        ],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          },
          {
            name: 'bar',
            segment: false,
            last: false,
            position: 7,
            size: 3
          },
          {
            name: 'last',
            segment: false,
            last: true,
            position: 11,
            size: 4
          }
        ],
        length: 4
      });
    });
    it('/foo/:id/bar/last', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/:id/bar/last'), {
        filled: [
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          }
        ],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          },
          {
            name: 'bar',
            segment: false,
            last: false,
            position: 7,
            size: 3
          },
          {
            name: 'last',
            segment: false,
            last: true,
            position: 11,
            size: 4
          }
        ],
        length: 4
      });
    });
  });

  describe('simple static-mixed route compact parse, `:id`', () => {
    it('/foo/:id/bar/last', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/:id/bar/last', true), {
        filled: [
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          }
        ],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          },
          {
            name: 'bar/last',
            segment: false,
            last: true,
            position: 7,
            size: 8
          }
        ],
        length: 3
      });
    });
    it('/foo/:id/bar/last', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/:id/bar/last', true), {
        filled: [
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          }
        ],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          },
          {
            name: 'bar/last',
            segment: false,
            last: true,
            position: 7,
            size: 8
          }
        ],
        length: 3
      });
    });
  });

  describe('simple dynamic route parse, `<id>`', () => {
    it('/foo/<id>', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/<id>'), {
        filled: [
          {
            name: 'id',
            segment: true,
            last: true,
            position: 5,
            size: 2
          }
        ],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'id',
            segment: true,
            last: true,
            position: 5,
            size: 2
          }
        ],
        length: 2
      });
    });
    it('/foo/<id>/', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/<id>/'), {
        filled: [
          {
            name: 'id',
            segment: true,
            last: true,
            position: 5,
            size: 2
          }
        ],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'id',
            segment: true,
            last: true,
            position: 5,
            size: 2
          }
        ],
        length: 2
      });
    });
  });

  describe('simple mixed route parse, `<id>`', () => {
    it('/foo/<id>/bar', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/<id>/bar'), {
        filled: [
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          }
        ],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          },
          {
            name: 'bar',
            segment: false,
            last: true,
            position: 7,
            size: 3
          }
        ],
        length: 3
      });
    });
    it('/foo/<id>/bar', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/<id>/bar'), {
        filled: [
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          }
        ],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          },
          {
            name: 'bar',
            segment: false,
            last: true,
            position: 7,
            size: 3
          }
        ],
        length: 3
      });
    });
  });

  describe('simple static-mixed route parse, `<id>`', () => {
    it('/foo/<id>/bar/last', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/<id>/bar/last'), {
        filled: [
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          }
        ],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          },
          {
            name: 'bar',
            segment: false,
            last: false,
            position: 7,
            size: 3
          },
          {
            name: 'last',
            segment: false,
            last: true,
            position: 11,
            size: 4
          }
        ],
        length: 4
      });
    });
    it('/foo/<id>/bar/last', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/<id>/bar/last'), {
        filled: [
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          }
        ],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          },
          {
            name: 'bar',
            segment: false,
            last: false,
            position: 7,
            size: 3
          },
          {
            name: 'last',
            segment: false,
            last: true,
            position: 11,
            size: 4
          }
        ],
        length: 4
      });
    });
  });

  describe('simple static-mixed route compact parse, `<id>`', () => {
    it('/foo/<id>/bar/last', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/<id>/bar/last', true), {
        filled: [
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          }
        ],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          },
          {
            name: 'bar/last',
            segment: false,
            last: true,
            position: 7,
            size: 8
          }
        ],
        length: 3
      });
    });
    it('/foo/<id>/bar/last', () => {
      assert.deepStrictEqual(segmentsSlice('/foo/<id>/bar/last', true), {
        filled: [
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          }
        ],
        segments: [
          {
            name: 'foo',
            segment: false,
            last: false,
            position: 1,
            size: 3
          },
          {
            name: 'id',
            segment: true,
            last: false,
            position: 5,
            size: 2
          },
          {
            name: 'bar/last',
            segment: false,
            last: true,
            position: 7,
            size: 8
          }
        ],
        length: 3
      });
    });
  });
});

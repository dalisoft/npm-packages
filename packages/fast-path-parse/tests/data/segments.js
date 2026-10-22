const segments = [
  {
    children: [
      {
        excepted: {
          filled: [],
          length: 2,
          segments: [
            {
              last: false,
              name: 'foo',
              position: 1,
              segment: false,
              size: 3
            },
            {
              last: true,
              name: 'bar',
              position: 5,
              segment: false,
              size: 3
            }
          ]
        },
        input: '/foo/bar',
        name: '/foo/bar',
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'static route parse'
  },
  {
    children: [
      {
        excepted: {
          filled: [],
          length: 1,
          segments: [
            {
              last: true,
              name: 'foo/bar',
              position: 1,
              segment: false,
              size: 7
            }
          ]
        },
        input: '/foo/bar',
        name: '/foo/bar',
        test_input: true,
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'static route compact parse'
  },
  {
    children: [
      {
        excepted: {
          filled: [
            {
              last: true,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            }
          ],
          length: 2,
          segments: [
            {
              last: false,
              name: 'foo',
              position: 1,
              segment: false,
              size: 3
            },
            {
              last: true,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            }
          ]
        },
        input: '/foo/:id',
        name: '/foo/:id',
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple dynamic route parse, `:id`'
  },
  {
    children: [
      {
        excepted: {
          filled: [
            {
              last: false,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            }
          ],
          length: 3,
          segments: [
            {
              last: false,
              name: 'foo',
              position: 1,
              segment: false,
              size: 3
            },
            {
              last: false,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            },
            {
              last: true,
              name: 'bar',
              position: 7,
              segment: false,
              size: 3
            }
          ]
        },
        input: '/foo/:id/bar',
        name: '/foo/:id/bar',
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple mixed route parse, `:id`'
  },
  {
    children: [
      {
        excepted: {
          filled: [
            {
              last: false,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            }
          ],
          length: 4,
          segments: [
            {
              last: false,
              name: 'foo',
              position: 1,
              segment: false,
              size: 3
            },
            {
              last: false,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            },
            {
              last: false,
              name: 'bar',
              position: 7,
              segment: false,
              size: 3
            },
            {
              last: true,
              name: 'last',
              position: 11,
              segment: false,
              size: 4
            }
          ]
        },
        input: '/foo/:id/bar/last',
        name: '/foo/:id/bar/last',
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple static-mixed route parse, `:id`'
  },
  {
    children: [
      {
        excepted: {
          filled: [
            {
              last: false,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            }
          ],
          length: 3,
          segments: [
            {
              last: false,
              name: 'foo',
              position: 1,
              segment: false,
              size: 3
            },
            {
              last: false,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            },
            {
              last: true,
              name: 'bar/last',
              position: 7,
              segment: false,
              size: 8
            }
          ]
        },
        input: '/foo/:id/bar/last',
        name: '/foo/:id/bar/last',
        test_input: true,
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple static-mixed route compact parse, `:id`'
  },
  {
    children: [
      {
        excepted: {
          filled: [
            {
              last: true,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            }
          ],
          length: 2,
          segments: [
            {
              last: false,
              name: 'foo',
              position: 1,
              segment: false,
              size: 3
            },
            {
              last: true,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            }
          ]
        },
        input: '/foo/<id>',
        name: '/foo/<id>',
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple dynamic route parse, `<id>`'
  },
  {
    children: [
      {
        excepted: {
          filled: [
            {
              last: false,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            }
          ],
          length: 3,
          segments: [
            {
              last: false,
              name: 'foo',
              position: 1,
              segment: false,
              size: 3
            },
            {
              last: false,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            },
            {
              last: true,
              name: 'bar',
              position: 7,
              segment: false,
              size: 3
            }
          ]
        },
        input: '/foo/<id>/bar',
        name: '/foo/<id>/bar',
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple mixed route parse, `<id>`'
  },
  {
    children: [
      {
        excepted: {
          filled: [
            {
              last: false,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            }
          ],
          length: 4,
          segments: [
            {
              last: false,
              name: 'foo',
              position: 1,
              segment: false,
              size: 3
            },
            {
              last: false,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            },
            {
              last: false,
              name: 'bar',
              position: 7,
              segment: false,
              size: 3
            },
            {
              last: true,
              name: 'last',
              position: 11,
              segment: false,
              size: 4
            }
          ]
        },
        input: '/foo/<id>/bar/last',
        name: '/foo/<id>/bar/last',
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple static-mixed route parse, `<id>`'
  },
  {
    children: [
      {
        excepted: {
          filled: [
            {
              last: false,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            }
          ],
          length: 3,
          segments: [
            {
              last: false,
              name: 'foo',
              position: 1,
              segment: false,
              size: 3
            },
            {
              last: false,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            },
            {
              last: true,
              name: 'bar/last',
              position: 7,
              segment: false,
              size: 8
            }
          ]
        },
        input: '/foo/<id>/bar/last',
        name: '/foo/<id>/bar/last',
        test_input: true,
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple static-mixed route compact parse, `<id>`'
  },
  {
    children: [
      {
        excepted: {
          filled: [
            {
              last: true,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            }
          ],
          length: 2,
          segments: [
            {
              last: false,
              name: 'foo',
              position: 1,
              segment: false,
              size: 3
            },
            {
              last: true,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            }
          ]
        },
        input: '/foo/bar-[one,two]',
        name: '/foo/bar-[one,two]',
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple dynamic route parse, `bar-[one,two]`'
  },
  {
    children: [
      {
        excepted: {
          filled: [
            {
              last: false,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            }
          ],
          length: 3,
          segments: [
            {
              last: false,
              name: 'foo',
              position: 1,
              segment: false,
              size: 3
            },
            {
              last: false,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            },
            {
              last: true,
              name: 'baz',
              position: 7,
              segment: false,
              size: 3
            }
          ]
        },
        input: '/foo/bar-[one,two]/baz',
        name: '/foo/bar-[one,two]/baz',
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple mixed route parse, `bar-[one,two]`'
  },
  {
    children: [
      {
        excepted: {
          filled: [
            {
              last: false,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            }
          ],
          length: 4,
          segments: [
            {
              last: false,
              name: 'foo',
              position: 1,
              segment: false,
              size: 3
            },
            {
              last: false,
              name: 'bar-*',
              position: 5,
              segment: true,
              size: 7
            },
            {
              last: false,
              name: 'baz',
              position: 7,
              segment: false,
              size: 3
            },
            {
              last: true,
              name: 'last',
              position: 11,
              segment: false,
              size: 4
            }
          ]
        },
        input: '/foo/bar-[one,two]/baz/last',
        name: '/foo/bar-[one,two]/baz/last',
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple static-mixed route parse, `bar-[one,two]`'
  },
  {
    children: [
      {
        excepted: {
          filled: [
            {
              last: false,
              name: 'id',
              position: 5,
              segment: true,
              size: 2
            }
          ],
          length: 3,
          segments: [
            {
              last: false,
              name: 'foo',
              position: 1,
              segment: false,
              size: 3
            },
            {
              last: false,
              name: 'bar-*',
              position: 5,
              segment: true,
              size: 7
            },
            {
              last: true,
              name: 'baz/last',
              position: 7,
              segment: false,
              size: 8
            }
          ]
        },
        input: '/foo/bar-[one,two]/baz/last',
        name: '/foo/bar-[one,two]/baz/last',
        test_input: true,
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple static-mixed route compact parse, `bar-[one,two]`'
  }
];

export default segments;

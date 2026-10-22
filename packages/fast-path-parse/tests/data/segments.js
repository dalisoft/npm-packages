const segments = [
  {
    children: [
      {
        input: '/foo/bar',
        name: '/foo/bar',
        result: {
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
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'static route parse'
  },
  {
    children: [
      {
        input: '/foo/bar',
        name: '/foo/bar',
        result: {
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
        test_input: true,
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'static route compact parse'
  },
  {
    children: [
      {
        input: '/foo/:id',
        name: '/foo/:id',
        result: {
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
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple dynamic route parse, `:id`'
  },
  {
    children: [
      {
        input: '/foo/:id/bar',
        name: '/foo/:id/bar',
        result: {
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
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple mixed route parse, `:id`'
  },
  {
    children: [
      {
        input: '/foo/:id/bar/last',
        name: '/foo/:id/bar/last',
        result: {
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
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple static-mixed route parse, `:id`'
  },
  {
    children: [
      {
        input: '/foo/:id/bar/last',
        name: '/foo/:id/bar/last',
        result: {
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
        test_input: true,
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple static-mixed route compact parse, `:id`'
  },
  {
    children: [
      {
        input: '/foo/<id>',
        name: '/foo/<id>',
        result: {
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
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple dynamic route parse, `<id>`'
  },
  {
    children: [
      {
        input: '/foo/<id>/bar',
        name: '/foo/<id>/bar',
        result: {
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
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple mixed route parse, `<id>`'
  },
  {
    children: [
      {
        input: '/foo/<id>/bar/last',
        name: '/foo/<id>/bar/last',
        result: {
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
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple static-mixed route parse, `<id>`'
  },
  {
    children: [
      {
        input: '/foo/<id>/bar/last',
        name: '/foo/<id>/bar/last',
        result: {
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
        test_input: true,
        variants: [['%s'], ['%s/']]
      }
    ],
    name: 'simple static-mixed route compact parse, `<id>`'
  }
];

export default segments;

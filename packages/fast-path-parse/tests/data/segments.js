const segments = [
  {
    name: 'static route parse',
    children: [
      {
        name: '/foo/bar',
        input: '/foo/bar',
        variants: [['%s'], ['%s/']],
        result: {
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
        }
      }
    ]
  },
  {
    name: 'static route compact parse',
    children: [
      {
        name: '/foo/bar',
        input: '/foo/bar',
        test_input: true,
        variants: [['%s'], ['%s/']],
        result: {
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
        }
      }
    ]
  },
  {
    name: 'simple dynamic route parse, `:id`',
    children: [
      {
        name: '/foo/:id',
        input: '/foo/:id',
        variants: [['%s'], ['%s/']],
        result: {
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
        }
      }
    ]
  },
  {
    name: 'simple mixed route parse, `:id`',
    children: [
      {
        name: '/foo/:id/bar',
        input: '/foo/:id/bar',
        variants: [['%s'], ['%s/']],
        result: {
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
        }
      }
    ]
  },
  {
    name: 'simple static-mixed route parse, `:id`',
    children: [
      {
        name: '/foo/:id/bar/last',
        input: '/foo/:id/bar/last',
        variants: [['%s'], ['%s/']],
        result: {
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
        }
      }
    ]
  },
  {
    name: 'simple static-mixed route compact parse, `:id`',
    children: [
      {
        name: '/foo/:id/bar/last',
        input: '/foo/:id/bar/last',
        test_input: true,
        variants: [['%s'], ['%s/']],
        result: {
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
        }
      }
    ]
  },
  {
    name: 'simple dynamic route parse, `<id>`',
    children: [
      {
        name: '/foo/<id>',
        input: '/foo/<id>',
        variants: [['%s'], ['%s/']],
        result: {
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
        }
      }
    ]
  },
  {
    name: 'simple mixed route parse, `<id>`',
    children: [
      {
        name: '/foo/<id>/bar',
        input: '/foo/<id>/bar',
        variants: [['%s'], ['%s/']],
        result: {
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
        }
      }
    ]
  },
  {
    name: 'simple static-mixed route parse, `<id>`',
    children: [
      {
        name: '/foo/<id>/bar/last',
        input: '/foo/<id>/bar/last',
        variants: [['%s'], ['%s/']],
        result: {
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
        }
      }
    ]
  },
  {
    name: 'simple static-mixed route compact parse, `<id>`',
    children: [
      {
        name: '/foo/<id>/bar/last',
        input: '/foo/<id>/bar/last',
        test_input: true,
        variants: [['%s'], ['%s/']],
        result: {
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
        }
      }
    ]
  }
];

export default segments;

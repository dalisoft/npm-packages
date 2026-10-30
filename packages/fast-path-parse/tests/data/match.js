const match = [
  {
    children: [
      {
        excepted: true,
        input: '/foo/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '2-level depth',
        test_input: '/foo/bar',
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        excepted: false,
        input: '/foo/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: false }],
        name: '2-level depth w/o ignoreTrailingSlash',
        test_input: '/foo/bar',
        variants: [
          ['%s/', '%s'],
          ['%s', '%s/']
        ]
      },
      {
        excepted: true,
        input: '/foo/bar/baz',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '3-level depth',
        test_input: '/foo/bar/baz',
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        excepted: false,
        input: '/foo/bar/baz',
        input_args: [{ compact: false, ignoreTrailingSlash: false }],
        name: '3-level depth w/o ignoreTrailingSlash',
        test_input: '/foo/bar/baz',
        variants: [
          ['%s/', '%s'],
          ['%s', '%s/']
        ]
      }
    ],
    name: 'No segment'
  },

  {
    children: [
      {
        excepted: true,
        input: '/foo/:id',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '2-level depth, `:id`',
        test_input: '/foo/123',
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        excepted: false,
        input: '/foo/:id',
        input_args: [{ compact: false, ignoreTrailingSlash: false }],
        name: '2-level depth, `:id` w/o ignoreTrailingSlash',
        test_input: '/foo/123',
        variants: [
          ['%s/', '%s'],
          ['%s', '%s/']
        ]
      },
      {
        excepted: false,
        input: '/foo/:id',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '2-level depth, `:id`',
        test_input: '/foo/',
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        excepted: false,
        input: '/foo/:id',
        input_args: [{ compact: false, ignoreTrailingSlash: false }],
        name: '2-level depth, `:id` w/o ignoreTrailingSlash',
        test_input: '/foo/',
        variants: [
          ['%s/', '%s'],
          ['%s', '%s/']
        ]
      },
      {
        excepted: true,
        input: '/foo/<id>',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '2-level depth, `<id>`',
        test_input: '/foo/123',
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        excepted: false,
        input: '/foo/<id>',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '2-level depth, `<id>`',
        test_input: '/foo/',
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        excepted: true,
        input: '/foo/:id/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '3-level depth, `:id`',
        test_input: '/foo/123/bar',
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        excepted: false,
        input: '/foo/:id/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '3-level depth, `:id`',
        test_input: '/foo/123',
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        excepted: true,
        input: '/foo/<id>/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '3-level depth, <id>',
        test_input: '/foo/123/bar',
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        excepted: false,
        input: '/foo/<id>/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '3-level depth, `<id>`',
        test_input: '/foo/123',
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        excepted: true,
        input: '/foo/bar/:id',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '3-level depth alternative, `:id`',
        test_input: '/foo/bar/123',
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        excepted: true,
        input: '/foo/:id/bar/:task',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '4-level depth',
        test_input: '/foo/123/bar/run',
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      }
    ],
    name: 'Simple segmenting'
  },

  {
    children: [
      {
        excepted: true,
        input: '/foo/:id/:task',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '3-level depth',
        test_input: '/foo/123/run',
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        excepted: true,
        input: '/foo/:id/:task/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '4-level depth',
        test_input: '/foo/123/run/bar',
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      }
    ],
    name: 'Average two segmenting'
  },
  {
    children: [
      {
        excepted: true,
        input: '/foo/*/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '/foo/*/bar',
        test_input: '/foo/123/bar'
      },
      {
        excepted: false,
        input: '/foo/*/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '/foo/*/bar',
        test_input: '/foo/123'
      },
      {
        excepted: true,
        input: '/foo/*/bar/*',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '/foo/*/bar/*',
        test_input: '/foo/123/bar/run'
      },
      {
        excepted: false,
        input: '/foo/*/bar/*',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '/foo/*/bar/*',
        test_input: '/foo/123/bar'
      }
    ],
    name: 'Simple * segment'
  },
  {
    children: [
      {
        excepted: true,
        input: '/foo/:id/*',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '/foo/:id/*',
        test_input: '/foo/123/bar'
      },
      {
        excepted: true,
        input: '/foo/*/*/*',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '/foo/*/*/*',
        test_input: '/foo/123/bar/run'
      },
      {
        excepted: true,
        input: '/foo/*/:id/*',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '/foo/*/:id/*',
        test_input: '/foo/123/bar/run'
      },
      {
        excepted: true,
        input: '/foo/*/:id/(.*)',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        name: '/foo/*/:id/(.*)',
        test_input: '/foo/123/bar/run'
      }
    ],
    name: 'Average * segment'
  }
];

export default match;

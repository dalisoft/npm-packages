const match = [
  {
    name: 'No segment',
    children: [
      {
        name: '2-level depth',
        input: '/foo/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/bar',
        excepted: true,
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        name: '2-level depth w/o ignoreTrailingSlash',
        input: '/foo/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: false }],
        test_input: '/foo/bar',
        excepted: false,
        variants: [
          ['%s/', '%s'],
          ['%s', '%s/']
        ]
      },
      {
        name: '3-level depth',
        input: '/foo/bar/baz',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/bar/baz',
        excepted: true,
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        name: '3-level depth w/o ignoreTrailingSlash',
        input: '/foo/bar/baz',
        input_args: [{ compact: false, ignoreTrailingSlash: false }],
        test_input: '/foo/bar/baz',
        excepted: false,
        variants: [
          ['%s/', '%s'],
          ['%s', '%s/']
        ]
      }
    ]
  },

  {
    name: 'Simple segmenting',
    children: [
      {
        name: '2-level depth, `:id`',
        input: '/foo/:id',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123',
        excepted: true,
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        name: '2-level depth, `:id` w/o ignoreTrailingSlash',
        input: '/foo/:id',
        input_args: [{ compact: false, ignoreTrailingSlash: false }],
        test_input: '/foo/123',
        excepted: false,
        variants: [
          ['%s/', '%s'],
          ['%s', '%s/']
        ]
      },
      {
        name: '2-level depth, `:id`',
        input: '/foo/:id',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/',
        excepted: false,
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        name: '2-level depth, `:id` w/o ignoreTrailingSlash',
        input: '/foo/:id',
        input_args: [{ compact: false, ignoreTrailingSlash: false }],
        test_input: '/foo/',
        excepted: false,
        variants: [
          ['%s/', '%s'],
          ['%s', '%s/']
        ]
      },
      {
        name: '2-level depth, `<id>`',
        input: '/foo/<id>',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123',
        excepted: true,
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        name: '2-level depth, `<id>`',
        input: '/foo/<id>',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/',
        excepted: false,
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        name: '3-level depth, `:id`',
        input: '/foo/:id/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123/bar',
        excepted: true,
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        name: '3-level depth, `:id`',
        input: '/foo/:id/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123',
        excepted: false,
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        name: '3-level depth, <id>',
        input: '/foo/<id>/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123/bar',
        excepted: true,
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        name: '3-level depth, `<id>`',
        input: '/foo/<id>/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123',
        excepted: false,
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        name: '3-level depth alternative, `:id`',
        input: '/foo/bar/:id',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/bar/123',
        excepted: true,
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        name: '4-level depth',
        input: '/foo/:id/bar/:task',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123/bar/run',
        excepted: true,
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      }
    ]
  },

  {
    name: 'Average two segmenting',
    children: [
      {
        name: '3-level depth',
        input: '/foo/:id/:task',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123/run',
        excepted: true,
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        name: '4-level depth',
        input: '/foo/:id/:task/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123/run/bar',
        excepted: true,
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      }
    ]
  },
  {
    name: 'Simple * segment',
    children: [
      {
        name: '/foo/*/bar',
        input: '/foo/*/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123/bar',
        excepted: true
      },
      {
        name: '/foo/*/bar',
        input: '/foo/*/bar',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123',
        excepted: false
      },
      {
        name: '/foo/*/bar/*',
        input: '/foo/*/bar/*',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123/bar/run',
        excepted: true
      },
      {
        name: '/foo/*/bar/*',
        input: '/foo/*/bar/*',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123/bar',
        excepted: false
      }
    ]
  },
  {
    name: 'Average * segment',
    children: [
      {
        name: '/foo/:id/*',
        input: '/foo/:id/*',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123/bar',
        excepted: true
      },
      {
        name: '/foo/*/*/*',
        input: '/foo/*/*/*',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123/bar/run',
        excepted: true
      },
      {
        name: '/foo/*/:id/*',
        input: '/foo/*/:id/*',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123/bar/run',
        excepted: true
      },
      {
        name: '/foo/*/:id/(.*)',
        input: '/foo/*/:id/(.*)',
        input_args: [{ compact: false, ignoreTrailingSlash: true }],
        test_input: '/foo/123/bar/run',
        excepted: true
      }
    ]
  }
];

export default match;

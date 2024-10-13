const match = [
  {
    name: 'No segment',
    children: [
      {
        name: '2-level depth',
        input: '/foo/bar',
        test_input: '/foo/bar',
        result: true,
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        name: '3-level depth',
        input: '/foo/bar/baz',
        test_input: '/foo/bar/baz',
        result: true,
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
    name: 'Simple segmenting',
    children: [
      {
        name: '2-level depth, `:id`',
        input: '/foo/:id',
        test_input: '/foo/123',
        result: true,
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      },
      {
        name: '2-level depth, `:id`',
        input: '/foo/:id',
        test_input: '/foo/',
        result: false,
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
        test_input: '/foo/123',
        result: true,
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
        test_input: '/foo/',
        result: false,
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
        test_input: '/foo/123/bar',
        result: true,
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
        test_input: '/foo/123',
        result: false,
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
        test_input: '/foo/123/bar',
        result: true,
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
        test_input: '/foo/123',
        result: false,
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
        test_input: '/foo/bar/123',
        result: true,
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
        test_input: '/foo/123/bar/run',
        result: true,
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
        test_input: '/foo/123/run',
        result: true,
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
        test_input: '/foo/123/run/bar',
        result: true,
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
        test_input: '/foo/123/bar',
        result: true
      },
      {
        name: '/foo/*/bar',
        input: '/foo/*/bar',
        test_input: '/foo/123',
        result: false
      },
      {
        name: '/foo/*/bar/*',
        input: '/foo/*/bar/*',
        test_input: '/foo/123/bar/run',
        result: true
      },
      {
        name: '/foo/*/bar/*',
        input: '/foo/*/bar/*',
        test_input: '/foo/123/bar',
        result: false
      }
    ]
  },
  {
    name: 'Average * segment',
    children: [
      {
        name: '/foo/:id/*',
        input: '/foo/:id/*',
        test_input: '/foo/123/bar',
        result: true
      },
      {
        name: '/foo/*/*/*',
        input: '/foo/*/*/*',
        test_input: '/foo/123/bar/run',
        result: true
      },
      {
        name: '/foo/*/:id/*',
        input: '/foo/*/:id/*',
        test_input: '/foo/123/bar/run',
        result: true
      },
      {
        name: '/foo/*/:id/(.*)',
        input: '/foo/*/:id/(.*)',
        test_input: '/foo/123/bar/run',
        result: true
      }
    ]
  }
];

export default match;

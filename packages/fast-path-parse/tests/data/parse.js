const parse = [
  {
    children: [
      {
        excepted: {},
        input: '/foo/bar',
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
        excepted: {},
        input: '/foo/bar/baz',
        name: '3-level depth',
        test_input: '/foo/bar/baz',
        variants: [
          ['%s', '%s'],
          ['%s/', '%s'],
          ['%s', '%s/'],
          ['%s/', '%s/']
        ]
      }
    ],
    name: 'No segment'
  },

  {
    children: [
      {
        excepted: { id: '123' },
        input: '/foo/:id',
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
        excepted: {},
        input: '/foo/:id',
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
        excepted: { id: '123' },
        input: '/foo/<id>',
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
        excepted: {},
        input: '/foo/<id>',
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
        excepted: { id: '123' },
        input: '/foo/:id/bar',
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
        excepted: {},
        input: '/foo/:id/bar',
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
        excepted: { id: '123' },
        input: '/foo/<id>/bar',
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
        excepted: {},
        input: '/foo/<id>/bar',
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
        excepted: { id: '123' },
        input: '/foo/bar/:id',
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
        excepted: {},
        input: '/foo/:id/bar/:task',
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
        excepted: { id: '123', task: 'run' },
        input: '/foo/:id/:task',
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
        excepted: { id: '123', task: 'run' },
        input: '/foo/:id/:task/bar',
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
        excepted: { '*1': '123' },
        input: '/foo/*/bar',
        name: '/foo/*/bar',
        test_input: '/foo/123/bar'
      },
      {
        excepted: {},
        input: '/foo/*/bar',
        name: '/foo/*/bar',
        test_input: '/foo/123'
      },
      {
        excepted: { '*1': '123', '*2': 'run' },
        input: '/foo/*/bar/*',
        name: '/foo/*/bar/*',
        test_input: '/foo/123/bar/run'
      },
      {
        excepted: {},
        input: '/foo/*/bar/*',
        name: '/foo/*/bar/*',
        test_input: '/foo/123/bar'
      }
    ],
    name: 'Simple * segment'
  },
  {
    children: [
      {
        excepted: { '*1': 'bar', id: '123' },
        input: '/foo/:id/*',
        name: '/foo/:id/*',
        test_input: '/foo/123/bar'
      },
      {
        excepted: { '*1': '123', '*2': 'bar', '*3': 'run' },
        input: '/foo/*/*/*',
        name: '/foo/*/*/*',
        test_input: '/foo/123/bar/run'
      },
      {
        excepted: {
          '*1': '123',
          '*2': 'run',
          id: 'bar'
        },
        input: '/foo/*/:id/*',
        name: '/foo/*/:id/*',
        test_input: '/foo/123/bar/run'
      },
      {
        excepted: {
          '*1': '123',
          '*2': 'run',
          id: 'bar'
        },
        input: '/foo/*/:id/(.*)',
        name: '/foo/*/:id/(.*)',
        test_input: '/foo/123/bar/run'
      }
    ],
    name: 'Average * segment'
  }
];

export default parse;

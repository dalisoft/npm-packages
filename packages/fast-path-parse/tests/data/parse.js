const parse = [
  {
    name: 'No segment',
    children: [
      {
        name: '2-level depth',
        input: '/foo/bar',
        test_input: '/foo/bar',
        result: {},
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
        result: {},
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
        result: { id: '123' },
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
        result: {},
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
        result: { id: '123' },
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
        result: {},
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
        result: { id: '123' },
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
        result: {},
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
        result: { id: '123' },
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
        result: {},
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
        result: { id: '123' },
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
        result: {},
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
        result: { id: '123', task: 'run' },
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
        result: { id: '123', task: 'run' },
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
        result: { '*1': '123' }
      },
      {
        name: '/foo/*/bar',
        input: '/foo/*/bar',
        test_input: '/foo/123',
        result: {}
      },
      {
        name: '/foo/*/bar/*',
        input: '/foo/*/bar/*',
        test_input: '/foo/123/bar/run',
        result: { '*1': '123', '*2': 'run' }
      },
      {
        name: '/foo/*/bar/*',
        input: '/foo/*/bar/*',
        test_input: '/foo/123/bar',
        result: {}
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
        result: { id: '123', '*1': 'bar' }
      },
      {
        name: '/foo/*/*/*',
        input: '/foo/*/*/*',
        test_input: '/foo/123/bar/run',
        result: { '*1': '123', '*2': 'bar', '*3': 'run' }
      },
      {
        name: '/foo/*/:id/*',
        input: '/foo/*/:id/*',
        test_input: '/foo/123/bar/run',
        result: {
          '*1': '123',
          id: 'bar',
          '*2': 'run'
        }
      },
      {
        name: '/foo/*/:id/(.*)',
        input: '/foo/*/:id/(.*)',
        test_input: '/foo/123/bar/run',
        result: {
          '*1': '123',
          id: 'bar',
          '*2': 'run'
        }
      }
    ]
  }
];

export default parse;

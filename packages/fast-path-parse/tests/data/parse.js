const parse = [
  {
    input: '/foo/bar',
    name: 'No segment',
    result: {},
    test_input: '/foo/bar',
    variants: [
      ['%s', '%s'],
      ['%s/', '%s'],
      ['%s', '%s/'],
      ['%s/', '%s/']
    ]
  },
  {
    input: '/foo/:id',
    name: 'Simple segmenting, `:id`',
    result: { id: '123' },
    test_input: '/foo/123',
    variants: [
      ['%s', '%s'],
      ['%s/', '%s'],
      ['%s', '%s/'],
      ['%s/', '%s/']
    ]
  },
  {
    input: '/foo/:id/bar',
    name: 'Simple segmenting 2, `:id`',
    result: { id: '123' },
    test_input: '/foo/123/bar',
    variants: [
      ['%s', '%s'],
      ['%s/', '%s'],
      ['%s', '%s/'],
      ['%s/', '%s/']
    ]
  },
  {
    input: '/foo/<id>',
    name: 'Simple segmenting, `<id>`',
    result: { id: '123' },
    test_input: '/foo/123',
    variants: [
      ['%s', '%s'],
      ['%s/', '%s'],
      ['%s', '%s/'],
      ['%s/', '%s/']
    ]
  },
  {
    input: '/foo/<id>/bar',
    name: 'Simple segmenting 2, `<id>`',
    result: { id: '123' },
    test_input: '/foo/123/bar',
    variants: [
      ['%s', '%s'],
      ['%s/', '%s'],
      ['%s', '%s/'],
      ['%s/', '%s/']
    ]
  },
  {
    input: '/foo/:id/bar/:task',
    name: 'Simple two segmenting',
    result: { id: '123', task: 'run' },
    test_input: '/foo/123/bar/run',
    variants: [
      ['%s', '%s'],
      ['%s/', '%s'],
      ['%s', '%s/'],
      ['%s/', '%s/']
    ]
  },
  {
    input: '/foo/:id/:task',
    name: 'Average two segmenting',
    result: { id: '123', task: 'run' },
    test_input: '/foo/123/run',
    variants: [
      ['%s', '%s'],
      ['%s/', '%s'],
      ['%s', '%s/'],
      ['%s/', '%s/']
    ]
  },
  {
    input: '/foo/:id/:task/bar',
    name: 'Average two segmenting 2',
    result: { id: '123', task: 'run' },
    test_input: '/foo/123/run/bar',
    variants: [
      ['%s', '%s'],
      ['%s/', '%s'],
      ['%s', '%s/'],
      ['%s/', '%s/']
    ]
  },
  {
    children: [
      {
        input: '/foo/*/bar',
        name: '/foo/*/bar',
        result: { '*1': '123' },
        test_input: '/foo/123/bar'
      },
      {
        input: '/foo/*/bar/*',
        name: '/foo/*/bar/*',
        result: { '*1': '123', '*2': 'run' },
        test_input: '/foo/123/bar/run'
      }
    ],
    name: 'Simple * segment'
  },
  {
    children: [
      {
        input: '/foo/:id/*',
        name: '/foo/:id/*',
        result: { '*1': 'bar', id: '123' },
        test_input: '/foo/123/bar'
      },
      {
        input: '/foo/*/*/*',
        name: '/foo/*/*/*',
        result: { '*1': '123', '*2': 'bar', '*3': 'run' },
        test_input: '/foo/123/bar/run'
      },
      {
        input: '/foo/*/:id/*',
        name: '/foo/*/:id/*',
        result: {
          '*1': '123',
          '*2': 'run',
          id: 'bar'
        },
        test_input: '/foo/123/bar/run'
      },
      {
        input: '/foo/*/:id/(.*)',
        name: '/foo/*/:id/(.*)',
        result: {
          '*1': '123',
          '*2': 'run',
          id: 'bar'
        },
        test_input: '/foo/123/bar/run'
      }
    ],
    name: 'Average * segment'
  }
];

export default parse;

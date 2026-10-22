const match = [
  {
    input: '/foo/bar',
    name: 'No segment',
    result: true,
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
    result: true,
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
    result: true,
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
    result: true,
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
    result: true,
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
    result: true,
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
    result: true,
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
    result: true,
    test_input: '/foo/123/run/bar',
    variants: [
      ['%s', '%s'],
      ['%s/', '%s'],
      ['%s', '%s/'],
      ['%s/', '%s/']
    ]
  }
];

export default match;

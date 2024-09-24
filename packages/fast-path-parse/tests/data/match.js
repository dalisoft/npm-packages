const match = [
  {
    name: 'No segment',
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
    name: 'Simple segmenting, `:id`',
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
    name: 'Simple segmenting 2, `:id`',
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
    name: 'Simple segmenting, `<id>`',
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
    name: 'Simple segmenting 2, `<id>`',
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
    name: 'Simple two segmenting',
    input: '/foo/:id/bar/:task',
    test_input: '/foo/123/bar/run',
    result: true,
    variants: [
      ['%s', '%s'],
      ['%s/', '%s'],
      ['%s', '%s/'],
      ['%s/', '%s/']
    ]
  },
  {
    name: 'Average two segmenting',
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
    name: 'Average two segmenting 2',
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
];

module.exports = match;

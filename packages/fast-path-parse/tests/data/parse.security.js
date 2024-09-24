const matchSecurity = [
  {
    name: 'process.exit security check',
    children: [
      {
        name: '/foo/process.exit(1)',
        input: '/foo/process.exit(1)',
        test_input: '/foo/(process.exit(1))',
        result: {}
      },
      {
        name: '/foo/process.exit(1)',
        input: '/foo/process.exit(1)',
        test_input: '/foo',
        result: {}
      },
      {
        name: '/foo/:bar',
        input: '/foo/:bar',
        test_input: '/foo/(process.exit(1))',
        result: { bar: '(process.exit(1))' }
      },
      {
        name: '/foo/:bar',
        input: '/foo/:bar',
        test_input: '/(process.exit(1))',
        result: {}
      },
      {
        name: '/:bar',
        input: '/:bar',
        test_input: '/(process.exit(1))',
        result: { bar: '(process.exit(1))' }
      }
    ]
  },
  {
    name: 'throw security check',
    children: [
      {
        name: '/foo/throw 1',
        input: '/foo/throw 1',
        test_input: '/foo throw 1',
        result: {}
      },
      {
        name: '/foo/throw 1',
        input: '/foo/throw 1',
        test_input: '/foo',
        result: {}
      },
      {
        name: '/foo/:bar',
        input: '/foo/:bar',
        test_input: '/foo/throw 1',
        result: { bar: 'throw 1' }
      },
      {
        name: '/foo/:bar',
        input: '/foo/:bar',
        test_input: '/throw 1',
        result: {}
      },
      {
        name: '/:bar',
        input: '/:bar',
        test_input: '/throw 1',
        result: { bar: 'throw 1' }
      }
    ]
  }
];

module.exports = matchSecurity;

const matchSecurity = [
  {
    children: [
      {
        input: '/foo/process.exit(1)',
        name: '/foo/process.exit(1)',
        result: {},
        test_input: '/foo/(process.exit(1))'
      },
      {
        input: '/foo/process.exit(1)',
        name: '/foo/process.exit(1)',
        result: {},
        test_input: '/foo'
      },
      {
        input: '/foo/:bar',
        name: '/foo/:bar',
        result: { bar: '(process.exit(1))' },
        test_input: '/foo/(process.exit(1))'
      },
      {
        input: '/foo/:bar',
        name: '/foo/:bar',
        result: {},
        test_input: '/(process.exit(1))'
      },
      {
        input: '/:bar',
        name: '/:bar',
        result: { bar: '(process.exit(1))' },
        test_input: '/(process.exit(1))'
      }
    ],
    name: 'process.exit security check'
  },
  {
    children: [
      {
        input: '/foo/throw 1',
        name: '/foo/throw 1',
        result: {},
        test_input: '/foo throw 1'
      },
      {
        input: '/foo/throw 1',
        name: '/foo/throw 1',
        result: {},
        test_input: '/foo'
      },
      {
        input: '/foo/:bar',
        name: '/foo/:bar',
        result: { bar: 'throw 1' },
        test_input: '/foo/throw 1'
      },
      {
        input: '/foo/:bar',
        name: '/foo/:bar',
        result: {},
        test_input: '/throw 1'
      },
      {
        input: '/:bar',
        name: '/:bar',
        result: { bar: 'throw 1' },
        test_input: '/throw 1'
      }
    ],
    name: 'throw security check'
  }
];

export default matchSecurity;

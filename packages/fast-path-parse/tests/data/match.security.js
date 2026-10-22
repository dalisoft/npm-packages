const matchSecurity = [
  {
    children: [
      {
        input: '/foo/process.exit(1)',
        name: '/foo/process.exit(1)',
        result: false,
        test_input: '/foo/(process.exit(1))'
      },
      {
        input: '/foo/process.exit(1)',
        name: '/foo/process.exit(1)',
        result: false,
        test_input: '/foo'
      },
      {
        input: '/foo/:bar',
        name: '/foo/:bar',
        result: true,
        test_input: '/foo/(process.exit(1))'
      },
      {
        input: '/foo/:bar',
        name: '/foo/:bar',
        result: false,
        test_input: '/(process.exit(1))'
      },
      {
        input: '/:bar',
        name: '/:bar',
        result: true,
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
        result: false,
        test_input: '/foo throw 1'
      },
      {
        input: '/foo/throw 1',
        name: '/foo/throw 1',
        result: false,
        test_input: '/foo'
      },
      {
        input: '/foo/:bar',
        name: '/foo/:bar',
        result: true,
        test_input: '/foo/throw 1'
      },
      {
        input: '/foo/:bar',
        name: '/foo/:bar',
        result: false,
        test_input: '/throw 1'
      },
      {
        input: '/:bar',
        name: '/:bar',
        result: true,
        test_input: '/throw 1'
      }
    ],
    name: 'throw security check'
  }
];

export default matchSecurity;

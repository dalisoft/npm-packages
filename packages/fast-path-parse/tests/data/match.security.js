const matchSecurity = [
  {
    name: 'process.exit security check',
    children: [
      {
        name: '/foo/process.exit(1)',
        input: '/foo/process.exit(1)',
        test_input: '/foo/(process.exit(1))',
        result: false
      },
      {
        name: '/foo/process.exit(1)',
        input: '/foo/process.exit(1)',
        test_input: '/foo',
        result: false
      },
      {
        name: '/foo/:bar',
        input: '/foo/:bar',
        test_input: '/foo/(process.exit(1))',
        result: true
      },
      {
        name: '/foo/:bar',
        input: '/foo/:bar',
        test_input: '/(process.exit(1))',
        result: false
      },
      {
        name: '/:bar',
        input: '/:bar',
        test_input: '/(process.exit(1))',
        result: true
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
        result: false
      },
      {
        name: '/foo/throw 1',
        input: '/foo/throw 1',
        test_input: '/foo',
        result: false
      },
      {
        name: '/foo/:bar',
        input: '/foo/:bar',
        test_input: '/foo/throw 1',
        result: true
      },
      {
        name: '/foo/:bar',
        input: '/foo/:bar',
        test_input: '/throw 1',
        result: false
      },
      {
        name: '/:bar',
        input: '/:bar',
        test_input: '/throw 1',
        result: true
      }
    ]
  }
];

export default matchSecurity;

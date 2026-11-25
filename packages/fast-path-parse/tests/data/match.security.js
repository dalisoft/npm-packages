const matchSecurity = [
  {
    children: [
      {
        excepted: false,
        input: '/foo/process.exit(1)',
        name: '/foo/process.exit(1)',
        test_input: '/foo/(process.exit(1))'
      },
      {
        excepted: false,
        input: '/foo/process.exit(1)',
        name: '/foo/process.exit(1)',
        test_input: '/foo'
      },
      {
        excepted: true,
        input: '/foo/:bar',
        name: '/foo/:bar',
        test_input: '/foo/(process.exit(1))'
      },
      {
        excepted: false,
        input: '/foo/:bar',
        name: '/foo/:bar',
        test_input: '/(process.exit(1))'
      },
      {
        excepted: true,
        input: '/:bar',
        name: '/:bar',
        test_input: '/(process.exit(1))'
      }
    ],
    name: 'process.exit security check'
  },
  {
    children: [
      {
        excepted: false,
        input: '/foo/throw 1',
        name: '/foo/throw 1',
        test_input: '/foo throw 1'
      },
      {
        excepted: false,
        input: '/foo/throw 1',
        name: '/foo/throw 1',
        test_input: '/foo'
      },
      {
        excepted: true,
        input: '/foo/:bar',
        name: '/foo/:bar',
        test_input: '/foo/throw 1'
      },
      {
        excepted: false,
        input: '/foo/:bar',
        name: '/foo/:bar',
        test_input: '/throw 1'
      },
      {
        excepted: true,
        input: '/:bar',
        name: '/:bar',
        test_input: '/throw 1'
      }
    ],
    name: 'throw security check'
  }
];

export default matchSecurity;

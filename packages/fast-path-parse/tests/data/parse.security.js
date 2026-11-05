const matchSecurity = [
  {
    children: [
      {
        excepted: {},
        input: '/foo/process.exit(1)',
        name: '/foo/process.exit(1)',
        test_input: '/foo/(process.exit(1))'
      },
      {
        excepted: {},
        input: '/foo/process.exit(1)',
        name: '/foo/process.exit(1)',
        test_input: '/foo'
      },
      {
        excepted: { bar: '(process.exit(1))' },
        input: '/foo/:bar',
        name: '/foo/:bar',
        test_input: '/foo/(process.exit(1))'
      },
      {
        excepted: {},
        input: '/foo/:bar',
        name: '/foo/:bar',
        test_input: '/(process.exit(1))'
      },
      {
        excepted: { bar: '(process.exit(1))' },
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
        excepted: {},
        input: '/foo/throw 1',
        name: '/foo/throw 1',
        test_input: '/foo throw 1'
      },
      {
        excepted: {},
        input: '/foo/throw 1',
        name: '/foo/throw 1',
        test_input: '/foo'
      },
      {
        excepted: { bar: 'throw 1' },
        input: '/foo/:bar',
        name: '/foo/:bar',
        test_input: '/foo/throw 1'
      },
      {
        excepted: {},
        input: '/foo/:bar',
        name: '/foo/:bar',
        test_input: '/throw 1'
      },
      {
        excepted: { bar: 'throw 1' },
        input: '/:bar',
        name: '/:bar',
        test_input: '/throw 1'
      }
    ],
    name: 'throw security check'
  }
];

export default matchSecurity;

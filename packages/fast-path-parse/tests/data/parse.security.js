const matchSecurity = [
  {
    name: 'process.exit security check',
    children: [
      {
        name: '/foo/process.exit(1)',
        input: '/foo/process.exit(1)',
        test_input: '/foo/(process.exit(1))',
        excepted: {}
      },
      {
        name: '/foo/process.exit(1)',
        input: '/foo/process.exit(1)',
        test_input: '/foo',
        excepted: {}
      },
      {
        name: '/foo/:bar',
        input: '/foo/:bar',
        test_input: '/foo/(process.exit(1))',
        excepted: { bar: '(process.exit(1))' }
      },
      {
        name: '/foo/:bar',
        input: '/foo/:bar',
        test_input: '/(process.exit(1))',
        excepted: {}
      },
      {
        name: '/:bar',
        input: '/:bar',
        test_input: '/(process.exit(1))',
        excepted: { bar: '(process.exit(1))' }
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
        excepted: {}
      },
      {
        name: '/foo/throw 1',
        input: '/foo/throw 1',
        test_input: '/foo',
        excepted: {}
      },
      {
        name: '/foo/:bar',
        input: '/foo/:bar',
        test_input: '/foo/throw 1',
        excepted: { bar: 'throw 1' }
      },
      {
        name: '/foo/:bar',
        input: '/foo/:bar',
        test_input: '/throw 1',
        excepted: {}
      },
      {
        name: '/:bar',
        input: '/:bar',
        test_input: '/throw 1',
        excepted: { bar: 'throw 1' }
      }
    ]
  }
];

export default matchSecurity;

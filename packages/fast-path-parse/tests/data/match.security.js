const matchSecurity = [
  {
    name: 'process.exit security check',
    children: [
      {
        name: '/foo/process.exit(1)',
        input: '/foo/process.exit(1)',
        test_input: '/foo/(process.exit(1))',
        excepted: false
      },
      {
        name: '/foo/process.exit(1)',
        input: '/foo/process.exit(1)',
        test_input: '/foo',
        excepted: false
      },
      {
        name: '/foo/:bar',
        input: '/foo/:bar',
        test_input: '/foo/(process.exit(1))',
        excepted: true
      },
      {
        name: '/foo/:bar',
        input: '/foo/:bar',
        test_input: '/(process.exit(1))',
        excepted: false
      },
      {
        name: '/:bar',
        input: '/:bar',
        test_input: '/(process.exit(1))',
        excepted: true
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
        excepted: false
      },
      {
        name: '/foo/throw 1',
        input: '/foo/throw 1',
        test_input: '/foo',
        excepted: false
      },
      {
        name: '/foo/:bar',
        input: '/foo/:bar',
        test_input: '/foo/throw 1',
        excepted: true
      },
      {
        name: '/foo/:bar',
        input: '/foo/:bar',
        test_input: '/throw 1',
        excepted: false
      },
      {
        name: '/:bar',
        input: '/:bar',
        test_input: '/throw 1',
        excepted: true
      }
    ]
  }
];

export default matchSecurity;

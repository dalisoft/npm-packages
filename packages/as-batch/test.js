const test = require('node:test');
const asBatch = require('.');

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('Method [Register]: Basic test', async (t) => {
  t.plan(4);

  const calling = new asBatch({
    key: 'my-call-batch-key',
    transform: (queries) =>
      'query {' + '\n  ' + queries.join('\n  ') + '\n' + '}',
    onRegisterTimeout: async (query) => {
      t.assert.strictEqual(
        query.startsWith('query {'),
        true,
        'Transforming does not work properly'
      );
      await timeout(2000);

      return {
        posts: [{ id: 1, type: 'post' }],
        users: [{ id: 10, type: 'user' }],
        photos: [{ id: 2, type: 'photo' }]
      };
    }
  });

  calling
    .register(
      () => `posts { id }`,
      (res) => res.posts
    )
    .then((posts) =>
      t.assert.deepStrictEqual(
        posts,
        [{ id: 1, type: 'post' }],
        'Value getting does not work properly'
      )
    );

  await timeout(50);

  calling
    .register(
      () => `users { id }`,
      (res) => res.users
    )
    .then((users) =>
      t.assert.deepStrictEqual(
        users,
        [{ id: 10, type: 'user' }],
        'Value getting does not work properly'
      )
    );

  await timeout(50);

  calling
    .register(
      () => `photos { id }`,
      (res) => res.photos
    )
    .then((photos) =>
      t.assert.deepStrictEqual(
        photos,
        [{ id: 2, type: 'photo' }],
        'Value getting does not work properly'
      )
    );

  await timeout(5000);
});

test('Method [Register]: Basic test with fake hacks', async (t) => {
  t.plan(4);

  const calling = new asBatch({
    key: 'my-call-batch-key',
    transform: (queries) =>
      'query {' + '\n  ' + queries.join('\n  ') + '\n' + '}',
    onRegisterTimeout: async (query) => {
      t.assert.strictEqual(
        query.startsWith('query {'),
        true,
        'Transforming does not work properly'
      );
      await timeout(2000);

      return {
        posts: [{ id: 1, type: 'post' }],
        users: [{ id: 10, type: 'user' }],
        photos: [{ id: 2, type: 'photo' }]
      };
    }
  });

  calling.register(() => `posts { id }`);

  await timeout(50);

  calling.register(() => `users { id }`);

  await timeout(50);

  const { posts, users, photos } = await calling.register(
    () => `photos { id }`,
    (res) => res
  );

  await timeout(200);

  t.assert.deepStrictEqual(
    posts,
    [{ id: 1, type: 'post' }],
    'Value getting does not work properly'
  );
  t.assert.deepStrictEqual(
    users,
    [{ id: 10, type: 'user' }],
    'Value getting does not work properly'
  );
  t.assert.deepStrictEqual(
    photos,
    [{ id: 2, type: 'photo' }],
    'Value getting does not work properly'
  );
});

test('Method [Register]: Basic test with {#FetchRegistered} method', async (t) => {
  t.plan(4);

  const calling = new asBatch({
    key: 'my-call-batch-key',
    transform: (queries) =>
      'query {' + '\n  ' + queries.join('\n  ') + '\n' + '}',
    onRegisterTimeout: async (query) => {
      t.assert.strictEqual(
        query.startsWith('query {'),
        true,
        'Transforming does not work properly'
      );
      await timeout(2000);

      return {
        posts: [{ id: 1, type: 'post' }],
        users: [{ id: 10, type: 'user' }],
        photos: [{ id: 2, type: 'photo' }]
      };
    }
  });

  calling.register(() => `posts { id }`);

  await timeout(50);

  calling.register(() => `users { id }`);

  await timeout(50);

  calling.register(() => `photos { id }`);

  await timeout(50);

  const { posts, users, photos } = await calling.fetchRegistered();

  t.assert.deepStrictEqual(
    posts,
    [{ id: 1, type: 'post' }],
    'Value getting does not work properly'
  );
  t.assert.deepStrictEqual(
    users,
    [{ id: 10, type: 'user' }],
    'Value getting does not work properly'
  );
  t.assert.deepStrictEqual(
    photos,
    [{ id: 2, type: 'photo' }],
    'Value getting does not work properly'
  );
});

test('Method [Register]: Async/Await test', async (t) => {
  t.plan(4);

  const calling = new asBatch({
    key: 'my-call-batch-key',
    transform: (queries) =>
      'query {' + '\n  ' + queries.join('\n  ') + '\n' + '}',
    onRegisterTimeout: async (query) => {
      t.assert.strictEqual(
        query.startsWith('query {'),
        true,
        'Transforming does not work properly'
      );
      await timeout(2000);

      return {
        posts: [{ id: 1, type: 'post' }],
        users: [{ id: 10, type: 'user' }],
        photos: [{ id: 2, type: 'photo' }]
      };
    }
  });

  const posts = calling.register(
    () => `posts { id }`,
    (res) => res.posts
  );

  await timeout(50);

  const users = calling.register(
    () => `users { id }`,
    (res) => res.users
  );

  await timeout(50);

  const photos = calling.register(
    () => `photos { id }`,
    (res) => res.photos
  );

  await timeout(200);

  t.assert.deepStrictEqual(
    await posts,
    [{ id: 1, type: 'post' }],
    'Value getting does not work properly'
  );
  t.assert.deepStrictEqual(
    await users,
    [{ id: 10, type: 'user' }],
    'Value getting does not work properly'
  );
  t.assert.deepStrictEqual(
    await photos,
    [{ id: 2, type: 'photo' }],
    'Value getting does not work properly'
  );
});

test('Method [Call]: Basic test', async (t) => {
  t.plan(4);

  const calling = new asBatch({
    key: 'my-call-batch-key',
    onCallsTimeout: async (calls) => {
      t.assert.ok(true);
      await timeout(2000);

      return await Promise.all(calls);
    }
  });

  calling
    .call(
      async () => {
        await timeout(500);
        return { posts: [{ id: 1, type: 'post' }], index: 1 };
      },
      (responses) => responses.find((response) => response.index === 1).posts
    )
    .then((posts) =>
      t.assert.deepStrictEqual(
        posts,
        [{ id: 1, type: 'post' }],
        'Value getting does not work properly'
      )
    );

  await timeout(50);

  calling
    .call(
      async () => {
        await timeout(500);
        return { users: [{ id: 10, type: 'user' }], index: 2 };
      },
      (responses) => responses.find((response) => response.index === 2).users
    )
    .then((users) =>
      t.assert.deepStrictEqual(
        users,
        [{ id: 10, type: 'user' }],
        'Value getting does not work properly'
      )
    );

  await timeout(50);

  calling
    .call(
      async () => {
        await timeout(500);
        return { photos: [{ id: 2, type: 'photo' }], index: 3 };
      },
      (responses) => responses.find((response) => response.index === 3).photos
    )
    .then((photos) =>
      t.assert.deepStrictEqual(
        photos,
        [{ id: 2, type: 'photo' }],
        'Value getting does not work properly'
      )
    );

  await timeout(5000);
});

test('Method [Call]: Basic test with fake hacks', async (t) => {
  t.plan(4);

  const calling = new asBatch({
    key: 'my-call-batch-key',
    onCallsTimeout: async (calls) => {
      t.assert.ok(true);
      await timeout(2000);

      return await Promise.all(calls);
    }
  });

  calling.call(
    async () => {
      await timeout(500);
      return { posts: [{ id: 1, type: 'post' }], index: 1 };
    },
    (responses) => responses.find((response) => response.index === 1).posts
  );

  await timeout(50);

  calling.call(
    async () => {
      await timeout(500);
      return { users: [{ id: 10, type: 'user' }], index: 2 };
    },
    (responses) => responses.find((response) => response.index === 2).users
  );

  await timeout(50);

  const { posts, users, photos } = await calling.call(
    async () => {
      await timeout(500);
      return { photos: [{ id: 2, type: 'photo' }], index: 3 };
    },
    (responses) => responses.reduce((acc, res) => ({ ...acc, ...res }), {})
  );

  await timeout(200);

  t.assert.deepStrictEqual(
    posts,
    [{ id: 1, type: 'post' }],
    'Value getting does not work properly'
  );
  t.assert.deepStrictEqual(
    users,
    [{ id: 10, type: 'user' }],
    'Value getting does not work properly'
  );
  t.assert.deepStrictEqual(
    photos,
    [{ id: 2, type: 'photo' }],
    'Value getting does not work properly'
  );
});

test('Method [Call]: Async/Await test', async (t) => {
  t.plan(4);

  const calling = new asBatch({
    key: 'my-call-batch-key',
    onCallsTimeout: async (calls) => {
      t.assert.ok(true);
      await timeout(2000);

      return await Promise.all(calls);
    }
  });

  const posts = calling.call(
    async () => {
      await timeout(500);
      return { posts: [{ id: 1, type: 'post' }], index: 1 };
    },
    (responses) => responses.find((response) => response.index === 1).posts
  );

  await timeout(50);

  const users = calling.call(
    async () => {
      await timeout(500);
      return { users: [{ id: 10, type: 'user' }], index: 2 };
    },
    (responses) => responses.find((response) => response.index === 2).users
  );

  await timeout(50);

  const photos = calling.call(
    async () => {
      await timeout(500);
      return { photos: [{ id: 2, type: 'photo' }], index: 3 };
    },
    (responses) => responses.find((response) => response.index === 3).photos
  );

  await timeout(200);

  t.assert.deepStrictEqual(
    await posts,
    [{ id: 1, type: 'post' }],
    'Value getting does not work properly'
  );
  t.assert.deepStrictEqual(
    await users,
    [{ id: 10, type: 'user' }],
    'Value getting does not work properly'
  );
  t.assert.deepStrictEqual(
    await photos,
    [{ id: 2, type: 'photo' }],
    'Value getting does not work properly'
  );
});

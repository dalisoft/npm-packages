import assert from 'node:assert/strict';
import test from 'node:test';
import AsBatch from './dist/es/as-batch.js';

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('Method [Register]: Basic test', { timeout: 30000 }, async (_t) => {
  let hookCalls = 0;
  let settled = 0;

  const calling = new AsBatch({
    key: 'my-call-batch-key',
    onRegisterTimeout: async (query) => {
      hookCalls++;
      assert.equal(
        query.startsWith('query {'),
        true,
        'Transforming does not work properly'
      );
      await timeout(2000);

      return {
        photos: [{ id: 2, type: 'photo' }],
        posts: [{ id: 1, type: 'post' }],
        users: [{ id: 10, type: 'user' }]
      };
    },
    transform: (queries) => `query {\n  ${queries.join('\n  ')}\n}`
  });

  calling
    .register(
      () => `posts { id }`,
      (res) => res.posts
    )
    .then((posts) => {
      settled++;
      assert.deepEqual(
        posts,
        [{ id: 1, type: 'post' }],
        'Value getting does not work properly'
      );
    });

  await timeout(50);

  calling
    .register(
      () => `users { id }`,
      (res) => res.users
    )
    .then((users) => {
      settled++;
      assert.deepEqual(
        users,
        [{ id: 10, type: 'user' }],
        'Value getting does not work properly'
      );
    });

  await timeout(50);

  calling
    .register(
      () => `photos { id }`,
      (res) => res.photos
    )
    .then((photos) => {
      settled++;
      assert.deepEqual(
        photos,
        [{ id: 2, type: 'photo' }],
        'Value getting does not work properly'
      );
    });

  await timeout(5000);

  assert.equal(settled, 3, 'Not every call was settled');

  assert.equal(hookCalls, 1, 'Batch handler was not called once');
});

test('Method [Register]: Basic test with fake hacks', {
  timeout: 30000
}, async (_t) => {
  let hookCalls = 0;

  const calling = new AsBatch({
    key: 'my-call-batch-key',
    onRegisterTimeout: async (query) => {
      hookCalls++;
      assert.equal(
        query.startsWith('query {'),
        true,
        'Transforming does not work properly'
      );
      await timeout(2000);

      return {
        photos: [{ id: 2, type: 'photo' }],
        posts: [{ id: 1, type: 'post' }],
        users: [{ id: 10, type: 'user' }]
      };
    },
    transform: (queries) => `query {\n  ${queries.join('\n  ')}\n}`
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

  assert.deepEqual(
    posts,
    [{ id: 1, type: 'post' }],
    'Value getting does not work properly'
  );
  assert.deepEqual(
    users,
    [{ id: 10, type: 'user' }],
    'Value getting does not work properly'
  );
  assert.deepEqual(
    photos,
    [{ id: 2, type: 'photo' }],
    'Value getting does not work properly'
  );

  assert.equal(hookCalls, 1, 'Batch handler was not called once');
});

test('Method [Register]: Basic test with {#FetchRegistered} method', {
  timeout: 30000
}, async (_t) => {
  let hookCalls = 0;

  const calling = new AsBatch({
    key: 'my-call-batch-key',
    onRegisterTimeout: async (query) => {
      hookCalls++;
      assert.equal(
        query.startsWith('query {'),
        true,
        'Transforming does not work properly'
      );
      await timeout(2000);

      return {
        photos: [{ id: 2, type: 'photo' }],
        posts: [{ id: 1, type: 'post' }],
        users: [{ id: 10, type: 'user' }]
      };
    },
    transform: (queries) => `query {\n  ${queries.join('\n  ')}\n}`
  });

  calling.register(() => `posts { id }`);

  await timeout(50);

  calling.register(() => `users { id }`);

  await timeout(50);

  calling.register(() => `photos { id }`);

  await timeout(50);

  const { posts, users, photos } = await calling.fetchRegistered();

  assert.deepEqual(
    posts,
    [{ id: 1, type: 'post' }],
    'Value getting does not work properly'
  );
  assert.deepEqual(
    users,
    [{ id: 10, type: 'user' }],
    'Value getting does not work properly'
  );
  assert.deepEqual(
    photos,
    [{ id: 2, type: 'photo' }],
    'Value getting does not work properly'
  );

  assert.equal(hookCalls, 1, 'Batch handler was not called once');
});

test('Method [Register]: Async/Await test', { timeout: 30000 }, async (_t) => {
  let hookCalls = 0;

  const calling = new AsBatch({
    key: 'my-call-batch-key',
    onRegisterTimeout: async (query) => {
      hookCalls++;
      assert.equal(
        query.startsWith('query {'),
        true,
        'Transforming does not work properly'
      );
      await timeout(2000);

      return {
        photos: [{ id: 2, type: 'photo' }],
        posts: [{ id: 1, type: 'post' }],
        users: [{ id: 10, type: 'user' }]
      };
    },
    transform: (queries) => `query {\n  ${queries.join('\n  ')}\n}`
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

  assert.deepEqual(
    await posts,
    [{ id: 1, type: 'post' }],
    'Value getting does not work properly'
  );
  assert.deepEqual(
    await users,
    [{ id: 10, type: 'user' }],
    'Value getting does not work properly'
  );
  assert.deepEqual(
    await photos,
    [{ id: 2, type: 'photo' }],
    'Value getting does not work properly'
  );

  assert.equal(hookCalls, 1, 'Batch handler was not called once');
});

test('Method [Call]: Basic test', { timeout: 30000 }, async (_t) => {
  let hookCalls = 0;
  let settled = 0;

  const calling = new AsBatch({
    key: 'my-call-batch-key',
    onCallsTimeout: async (calls) => {
      hookCalls++;
      await timeout(2000);

      return await Promise.all(calls);
    }
  });

  calling
    .call(
      async () => {
        await timeout(500);
        return { index: 1, posts: [{ id: 1, type: 'post' }] };
      },
      (responses) => responses.find((response) => response.index === 1).posts
    )
    .then((posts) => {
      settled++;
      assert.deepEqual(
        posts,
        [{ id: 1, type: 'post' }],
        'Value getting does not work properly'
      );
    });

  await timeout(50);

  calling
    .call(
      async () => {
        await timeout(500);
        return { index: 2, users: [{ id: 10, type: 'user' }] };
      },
      (responses) => responses.find((response) => response.index === 2).users
    )
    .then((users) => {
      settled++;
      assert.deepEqual(
        users,
        [{ id: 10, type: 'user' }],
        'Value getting does not work properly'
      );
    });

  await timeout(50);

  calling
    .call(
      async () => {
        await timeout(500);
        return { index: 3, photos: [{ id: 2, type: 'photo' }] };
      },
      (responses) => responses.find((response) => response.index === 3).photos
    )
    .then((photos) => {
      settled++;
      assert.deepEqual(
        photos,
        [{ id: 2, type: 'photo' }],
        'Value getting does not work properly'
      );
    });

  await timeout(5000);

  assert.equal(settled, 3, 'Not every call was settled');

  assert.equal(hookCalls, 1, 'Batch handler was not called once');
});

test('Method [Call]: Basic test with fake hacks', {
  timeout: 30000
}, async (_t) => {
  let hookCalls = 0;

  const calling = new AsBatch({
    key: 'my-call-batch-key',
    onCallsTimeout: async (calls) => {
      hookCalls++;
      await timeout(2000);

      return await Promise.all(calls);
    }
  });

  calling.call(
    async () => {
      await timeout(500);
      return { index: 1, posts: [{ id: 1, type: 'post' }] };
    },
    (responses) => responses.find((response) => response.index === 1).posts
  );

  await timeout(50);

  calling.call(
    async () => {
      await timeout(500);
      return { index: 2, users: [{ id: 10, type: 'user' }] };
    },
    (responses) => responses.find((response) => response.index === 2).users
  );

  await timeout(50);

  const { posts, users, photos } = await calling.call(
    async () => {
      await timeout(500);
      return { index: 3, photos: [{ id: 2, type: 'photo' }] };
    },
    (responses) => responses.reduce((acc, res) => ({ ...acc, ...res }), {})
  );

  await timeout(200);

  assert.deepEqual(
    posts,
    [{ id: 1, type: 'post' }],
    'Value getting does not work properly'
  );
  assert.deepEqual(
    users,
    [{ id: 10, type: 'user' }],
    'Value getting does not work properly'
  );
  assert.deepEqual(
    photos,
    [{ id: 2, type: 'photo' }],
    'Value getting does not work properly'
  );

  assert.equal(hookCalls, 1, 'Batch handler was not called once');
});

test('Method [Call]: Async/Await test', { timeout: 30000 }, async (_t) => {
  let hookCalls = 0;

  const calling = new AsBatch({
    key: 'my-call-batch-key',
    onCallsTimeout: async (calls) => {
      hookCalls++;
      await timeout(2000);

      return await Promise.all(calls);
    }
  });

  const posts = calling.call(
    async () => {
      await timeout(500);
      return { index: 1, posts: [{ id: 1, type: 'post' }] };
    },
    (responses) => responses.find((response) => response.index === 1).posts
  );

  await timeout(50);

  const users = calling.call(
    async () => {
      await timeout(500);
      return { index: 2, users: [{ id: 10, type: 'user' }] };
    },
    (responses) => responses.find((response) => response.index === 2).users
  );

  await timeout(50);

  const photos = calling.call(
    async () => {
      await timeout(500);
      return { index: 3, photos: [{ id: 2, type: 'photo' }] };
    },
    (responses) => responses.find((response) => response.index === 3).photos
  );

  await timeout(200);

  assert.deepEqual(
    await posts,
    [{ id: 1, type: 'post' }],
    'Value getting does not work properly'
  );
  assert.deepEqual(
    await users,
    [{ id: 10, type: 'user' }],
    'Value getting does not work properly'
  );
  assert.deepEqual(
    await photos,
    [{ id: 2, type: 'photo' }],
    'Value getting does not work properly'
  );

  assert.equal(hookCalls, 1, 'Batch handler was not called once');
});

import assert from 'node:assert/strict';
import test from 'node:test';
import batchCollect from './src/batch-collect.js';

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('Basic test', async (_t) => {
  let queryIndex = 0;
  let reacted = 0;
  const batchQuery = batchCollect(async (collects) => {
    await timeout(500);

    queryIndex++;

    return collects.map((collect) => ({
      responseOf: collect
    }));
  });

  batchQuery(() => `getUser { id, name }`);

  await batchQuery(async () => {
    await timeout(100);
    return `getAsync { result }`;
  });

  batchQuery(`getProfile {id, avatar}`);

  await timeout(500);

  batchQuery(
    () => `getMessages { id, text }`,
    (response) => {
      reacted++;
      assert.deepEqual(response, {
        responseOf: `getMessages { id, text }`
      });
    }
  );

  await timeout(1000);

  assert.equal(queryIndex, 3, 'Query called properly');
  assert.equal(reacted, 1, 'Reaction was not called');
});

test('Duplicate handling', async (_t) => {
  let queryIndex = 0;
  const batchQuery = batchCollect(async (collects) => {
    await timeout(500);

    assert.equal(
      collects.length,
      1,
      'Collect deduplication not works properly'
    );

    return collects.map((collect) => ({
      responseOf: collect
    }));
  });

  const graphqlQuery = `getUserAtDifferentPlace { id, name }`;

  const resolver = ({ responseOf }) => {
    if (graphqlQuery === responseOf) {
      queryIndex++;
    }
  };

  batchQuery(() => graphqlQuery, resolver);
  batchQuery(graphqlQuery, resolver);

  await timeout(0);

  batchQuery(() => graphqlQuery, resolver);

  await timeout(50);

  batchQuery(() => graphqlQuery, resolver);

  await timeout(500);

  batchQuery(() => graphqlQuery, resolver);

  await timeout(500);

  assert.equal(queryIndex, 5, 'Duplication handling not works as expected');
});

test('N+1 solving', async (_t) => {
  const handleIds = (ids) => ids.map((id) => ({ result: id }));

  const batchN1 = batchCollect(async (ids) => {
    await timeout(10);

    return handleIds(ids);
  });

  const handleResult =
    (id) =>
    ({ result }) =>
      assert.equal(result, id, 'Id returned incorrectly');

  batchN1(() => 1, handleResult(1));
  batchN1(2, handleResult(2));

  await timeout(0);

  batchN1(() => 3, handleResult(3));

  await timeout(20);

  batchN1(() => 4, handleResult(4));

  await timeout(50);

  batchN1(5, handleResult(5));

  await timeout(100);
});

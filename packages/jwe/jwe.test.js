import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import test from 'node:test';
import { setTimeout as sleep } from 'node:timers/promises';
import * as JWE from './src/jwe.js';

const key = crypto.randomBytes(64);

test('JWE Basic features ', async (_t) => {
  const payload = {
    my: {
      user: 'data'
    },
    role: 'admin'
  };
  const signed = await JWE.sign(payload, key, { expiresIn: 2 });
  assert.ok(signed, 'Signing token was passed');

  const verify = await JWE.verify(signed, key);

  assert.deepEqual(verify.payload, payload, 'Verify token was not passed');

  await assert.rejects(
    JWE.verify(`a${signed}`, key),
    { message: 'Validation error' },
    'Verify invalid token is passed and this mean this does not work properly'
  );

  const decode = await JWE.decode(signed, key);
  assert.deepEqual(decode.payload, payload, 'Decode token was not passed');

  await sleep(3000);

  await assert.rejects(
    JWE.verify(signed, key),
    { message: 'Token expired' },
    'JWE Expiration does not work properly'
  );
});

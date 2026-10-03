import test from 'node:test';
import * as JWE from './src/jwe.js';
import crypto from 'crypto';

const key = crypto.randomBytes(64);

test('JWE Basic features ', (t) =>
  new Promise(async (resolve) => {
    t.plan(5);

    const payload = {
      my: {
        user: 'data'
      },
      role: 'admin'
    };
    const signed = await JWE.sign(payload, key, { expiresIn: 2 });
    t.assert.ok(true, 'Signing token was passed');

    const verify = await JWE.verify(signed, key);

    t.assert.deepStrictEqual(
      verify.payload,
      payload,
      'Verify token was not passed'
    );

    await t.assert.rejects(
      JWE.verify('a' + signed, key),
      { message: 'Validation error' },
      'Verify invalid token is passed and this mean this does not work properly'
    );

    const decode = await JWE.decode(signed, key);
    t.assert.deepStrictEqual(
      decode.payload,
      payload,
      'Decode token was not passed'
    );

    setTimeout(async () => {
      await t.assert.rejects(
        JWE.verify(signed, key),
        { message: 'Token expired' },
        'JWE Expiration does not work properly'
      );
      resolve();
    }, 3000);
  }));

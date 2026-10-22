// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable max-lines-per-function */
import assert from 'node:assert/strict';
import test from 'node:test';
import * as JWT from './dist/es/jwt.js';

const secretKey = 'asdfadsf_secretKey';
const salt =
  'some-secure-128-bit-salt-key-for-getting-private-key--pem-key-string-would-be-helpful';

test('JWT Basic features ', async (_t) => {
  const TIME_START = Math.floor(Date.now() / 1000);
  const payload1 = {
    exp: TIME_START + 2,
    iat: TIME_START,
    my: {
      secure: false,
      user: 'data'
    },
    role: 'admin'
  };
  const signed = await JWT.sign(payload1, secretKey);

  assert.ok(signed, 'Signing token was passed');

  const verify1 = await JWT.verify(signed, secretKey);

  assert.deepEqual(verify1, payload1, 'Verify token is not passed');
  assert.deepEqual(await JWT.decode(signed, secretKey), payload1);

  await assert.rejects(
    JWT.verify(signed.replace(/./, '..'), secretKey),
    { message: 'jwt malformed', name: 'JsonWebTokenError' },
    'Invalid token was passed and this mean function does not work properly'
  );

  const TIME_MIDDLE = Math.floor(Date.now() / 1000);
  const payload2 = {
    exp: TIME_MIDDLE + 2,
    iat: TIME_MIDDLE,
    my: {
      secure: true,
      user: 'data'
    },
    role: 'admin'
  };

  const signedAndEncoded = await JWT.sign(payload2, secretKey, {}, true);

  assert.ok(signedAndEncoded, 'Signing and encoding token was passed');
  const verify2 = await JWT.verify(signedAndEncoded, secretKey, {}, true);
  assert.deepEqual(verify2, payload2, 'Verify token is not passed');
  assert.deepEqual(
    await JWT.decode(signedAndEncoded, secretKey, {}, true),
    payload2
  );

  await assert.rejects(
    JWT.verify(`${signedAndEncoded}a`, secretKey, {}, true),
    { message: 'jwt malformed', name: 'JsonWebTokenError' },
    'Invalid token was passed and this mean function does not work properly'
  );

  await new Promise((resolve) =>
    setTimeout(async () => {
      await assert.rejects(
        JWT.verify(signed, secretKey),
        { message: 'jwt expired', name: 'TokenExpiredError' },

        'Expired token was passed and this mean function does not work properly'
      );
      await assert.rejects(
        JWT.verify(signedAndEncoded, secretKey, {}, true),
        { message: 'jwt expired', name: 'TokenExpiredError' },
        'Expired token was passed and this mean function does not work properly'
      );
      resolve();
    }, 3000)
  );
});

test('JWT Generate token and Refresh token', async (_t) => {
  await JWT.generateToken(
    {
      my: {
        secure: false,
        user: 'data'
      },
      role: 'admin'
    },
    secretKey,
    {
      expiresIn: -100
    }
  )
    .then((res) => JWT.refreshToken({ ...res, privateKey: secretKey }))
    .then(({ accessToken }) => JWT.verify(accessToken, secretKey, undefined))
    .then((payload) => assert.ok(payload, 'Refresh token worked perfectly'));

  await JWT.generateToken(
    {
      my: {
        secure: true,
        user: 'data'
      },
      role: 'admin'
    },
    secretKey,
    {
      expiresIn: -100
    },
    true,
    salt
  )
    .then((res) => JWT.refreshToken({ ...res, salt }))
    .then(({ accessToken }) =>
      JWT.verify(accessToken, secretKey, undefined, true)
    )
    .then((payload) => assert.ok(payload, 'Refresh token worked perfectly'));

  await JWT.generateToken(
    {
      my: {
        secure: false,
        user: 'data'
      },
      role: 'admin'
    },
    secretKey,
    {
      expiresIn: 1000
    }
  )
    .then((res) => JWT.refreshToken({ ...res, privateKey: secretKey }))
    .then(({ accessToken }) => JWT.verify(accessToken, secretKey, undefined))
    .then((payload) => assert.ok(payload, 'Refresh token worked perfectly'));

  await JWT.generateToken(
    {
      my: {
        secure: true,
        user: 'data'
      },
      role: 'admin'
    },
    secretKey,
    {
      expiresIn: 1000
    },
    true,
    salt
  )
    .then((res) => JWT.refreshToken({ ...res, salt }))
    .then(({ accessToken }) =>
      JWT.verify(accessToken, secretKey, undefined, true)
    )
    .then((payload) => assert.ok(payload, 'Refresh token worked perfectly'));
});

// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable max-lines-per-function */
// eslint-disable-next-line import-x/no-extraneous-dependencies, n/no-extraneous-import
import test from 'ava';
import * as JWT from './dist/es/jwt.js';
import jwt from 'jsonwebtoken';

const secretKey = 'asdfadsf_secretKey';
const salt =
  'some-secure-128-bit-salt-key-for-getting-private-key--pem-key-string-would-be-helpful';

test('JWT Basic features ', async (t) => {
  t.timeout(5000);
  t.plan(10);

  const TIME_START = Math.floor(Date.now() / 1000);
  const payload1 = {
    exp: TIME_START + 2,
    iat: TIME_START,
    my: {
      user: 'data',
      secure: false
    },
    role: 'admin'
  };
  const signed = await JWT.sign(payload1, secretKey);

  t.pass('Signing token was passed');

  const verify1 = await JWT.verify(signed, secretKey);

  t.deepEqual(verify1, payload1, 'Verify token is not passed');
  t.deepEqual(await JWT.decode(signed, secretKey), payload1);

  t.throwsAsync(
    JWT.verify(signed.replace(/./, '..'), secretKey),
    { instanceOf: jwt.JsonWebTokenError, message: 'jwt malformed', any: true },
    'Invalid token was passed and this mean function does not work properly'
  );

  const TIME_MIDDLE = Math.floor(Date.now() / 1000);
  const payload2 = {
    exp: TIME_MIDDLE + 2,
    iat: TIME_MIDDLE,
    my: {
      user: 'data',
      secure: true
    },
    role: 'admin'
  };

  const signedAndEncoded = await JWT.sign(payload2, secretKey, {}, true);

  t.pass('Signing and encoding token was passed');
  const verify2 = await JWT.verify(signedAndEncoded, secretKey, {}, true);
  t.deepEqual(verify2, payload2, 'Verify token is not passed');
  t.deepEqual(
    await JWT.decode(signedAndEncoded, secretKey, {}, true),
    payload2
  );

  t.throwsAsync(
    JWT.verify(`${signedAndEncoded  }a`, secretKey, {}, true),
    { instanceOf: jwt.JsonWebTokenError, message: 'jwt malformed', any: true },
    'Invalid token was passed and this mean function does not work properly'
  );

  await new Promise((resolve) =>
    setTimeout(async () => {
      await t.throwsAsync(
        JWT.verify(signed, secretKey),
        { instanceOf: jwt.TokenExpiredError, message: 'jwt expired', any: true },

        'Expired token was passed and this mean function does not work properly'
      );
      await t.throwsAsync(
        JWT.verify(signedAndEncoded, secretKey, {}, true),
        { instanceOf: jwt.TokenExpiredError, message: 'jwt expired', any: true },
        'Expired token was passed and this mean function does not work properly'
      );
      resolve();
    }, 3000));
});

test('JWT Generate token and Refresh token', async (t) => {
  t.plan(4);

  await JWT.generateToken(
    {
      my: {
        user: 'data',
        secure: false
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
    .then(() => t.pass('Refresh token worked perfectly'));

  await JWT.generateToken(
    {
      my: {
        user: 'data',
        secure: true
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
    .then(() => t.pass('Refresh token worked perfectly'));

  await JWT.generateToken(
    {
      my: {
        user: 'data',
        secure: false
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
    .then(() => t.pass('Refresh token worked perfectly'));

  await JWT.generateToken(
    {
      my: {
        user: 'data',
        secure: true
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
    .then(() => t.pass('Refresh token worked perfectly'));
});

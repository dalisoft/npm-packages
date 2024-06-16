import jwt, { type SignOptions } from 'jsonwebtoken';
import { encrypt } from './utils';

const signJWT = (
  payload: string | Buffer | object,
  secretOrPrivate: Secret,
  options: SignOptions = {},
  encode?: boolean
): Promise<string> =>
  new Promise((resolve, reject): void =>
    jwt.sign(payload, secretOrPrivate, options, (err, encoded): void => {
      if (err) {
        return reject(err);
      }
      resolve(encoded);
    })
  ).then((value: any): string | PromiseLike<string> => {
    if (encode) {
      return encrypt(secretOrPrivate, value) as string;
    }
    return value;
  });

export { signJWT as sign };

import jwt, { type GetPublicKeyOrSecret, type VerifyOptions } from 'jsonwebtoken';
import { decrypt } from './utils';

const verifyJWT = (
  token: string,
  secretOrPrivate: GetPublicKeyOrSecret,
  options?: VerifyOptions,
  encoded?: boolean
): Promise<string | object> =>
  new Promise((resolve, reject): void =>
    jwt.verify(
      encoded ? decrypt(secretOrPrivate, token) : token,
      secretOrPrivate,
      options,
      (err, decoded): any => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      }
    )
  );

export { verifyJWT as verify };

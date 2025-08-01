import fsPromise from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Convert dotenv values into proper TypeScript values
 * @param {string} value
 * @returns {string}
 */
const convertType = (value) => {
  if (value === '') {
    return '';
  }
  if (value === 'true' || value === 'false') {
    return value;
  }
  if (!Number.isNaN(Number(value))) {
    // TODO: use `Number(value)`?
    return `"${value}"`;
  }
  if (value.startsWith('"')) {
    return value;
  }

  return `"${value}"`;
};

/**
 * Activate `dotenv` to `TypeScript` conversion
 * @type {import('./lib.d.ts').activate}
 * @param options.on On which ENV value get's activated `TypeScript` conversion
 * @param options.envs List of ENV values to be inferred
 * @returns Activation status
 * @example
 * ```ts
 * await activate({on: 'DEVELOPMENT', envs: ['DEVELOPMENT', 'PRODUCTION']})
 * ```
 */
export async function activate(options) {
  const projectRoot = path.resolve('.');
  const envFilePath = path.resolve(projectRoot, '.env');

  if (process.env.NODE_ENV !== options.on) {
    return false;
  }

  const isFileExists = fs.existsSync(envFilePath);

  if (isFileExists) {
    const envFile = await fsPromise.readFile(envFilePath, {
      encoding: 'utf-8'
    });

    let type = `declare namespace NodeJS {
  interface ProcessEnv {
`;

    for (const env of envFile.split('\n')) {
      if (!env.trim() || env.startsWith('#')) {
        continue;
      }
      const [key, value] = env.trim().split('=');

      if (value) {
        const valueTyped =
          key === 'NODE_ENV'
            ? options.envs.map((_env) => `"${_env}"`).join(' | ')
            : convertType(value);

        type += `    ${key}: ${valueTyped},\n`;
      }
    }

    type += `  }
}`;

    await fsPromise
      .mkdir(path.resolve(projectRoot, 'types'), { recursive: true })
      .catch(() => {
        //
      });
    await fsPromise.writeFile(
      path.resolve(projectRoot, 'types/env.d.ts'),
      type
    );
  }

  return true;
}

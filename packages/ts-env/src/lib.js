import fsPromise from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';

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

    const convertType = (value, key) => {
      if (key === 'NODE_ENV') {
        return options.envs.map((env) => `"${env}"`).join(' | ');
      }
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

    let type = `declare namespace NodeJS {
  interface ProcessEnv {
`;

    for (const env of envFile.split('\n')) {
      if (!env.trim() || env.startsWith('#')) {
        continue;
      }
      const [key, value] = env.trim().split('=');

      if (value) {
        const valueTyped = convertType(value, key);

        type += `    ${key}: ${valueTyped},\n`;
      }
    }

    type += `
  }
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

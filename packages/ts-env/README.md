# ts-env

dotenv for TypeScript

## Features

- Smart env
- TypeScript integration
- Easy to use

## Usage

Make sure you following the guide

- Create `/types` directory
- Add `types` directory to `tsconfig.json`
- Add `types/env.d.ts` to `.gitignore`

### VSCode `settings.json`

```json
{
  "typescript.validate.enable": true
}
```

### `.gitignore`

```diff
+ types/env.d.ts
```

### `tsconfig.json` (optional)

```diff
{
-  "include": ["src"],
+  "include": ["src", "types"],
  "compilerOptions": {
    "typeRoots": [
+      "types"
    ]
  }
}

```

### You entrypoint

```js
import { activate } from 'ts-env';

await activate({
  on: 'DEVELOPMENT',
  envs: ['DEVELOPMENT', 'TESTING', 'PRODUCTION'] as const // This `const` is important
});
```

## License

MIT

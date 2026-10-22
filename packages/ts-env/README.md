# tss-env

dotenv typings for TypeScript

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

### `.env`

```env
NODE_ENV=development
```

### You entrypoint (auto-mode)

```js
import 'tss-env/auto';
```

### You entrypoint (manual mode, flexible)

```js
import { activate } from 'tss-env';

await activate({
  on: 'development', // This should at `.env` NODE_ENV to be activated
  envs: ['development', 'test', 'production'] as const // This `const` is important
});
```

## License

MIT

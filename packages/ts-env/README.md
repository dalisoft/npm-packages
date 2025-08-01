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

### You entrypoint (auto-mode)

```js
import 'tss-env/auto';
```

### You entrypoint (manual mode, flexible)

```js
import { activate } from 'tss-env';

await activate({
  on: 'development',
  envs: ['development', 'test', 'production'] as const // This `const` is important
});
```

## License

MIT

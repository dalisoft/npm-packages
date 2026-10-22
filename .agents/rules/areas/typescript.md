---
paths:
  - "**/*.{ts,tsx,mts,cts}"
  - "**/tsconfig*.json"
---

# TypeScript

- Strict mode and ESM only; no CommonJS. Avoid `any`; no `@ts-ignore`, and `@ts-expect-error` only with a
  one-line reason.
- `async`/`await` over promise chains. Parse unknown input at the boundary with the project's schema library
  (zod or valibot), or typed parsing on a client.
- One strict root `tsconfig.json` that packages extend: ESNext modules, Bundler resolution, `isolatedModules`,
  `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`.
- JSDoc (`/** … */`) is the doc comment format.
- File names: helpers and utils are camelCase, API and server modules lower-case (kebab-case when multi-word).
- Never edit generated files (`*.gen.ts`, migrations, build output); regenerate them.

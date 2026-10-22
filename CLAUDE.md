# CLAUDE: Guides Principles

## Planning

See @PLANNING.md for project planning.
Ask questions when necessary.

But NEVER do:

- Do something else than out of scope of project

## Codebase

Follow my recommendations:

- Prefer ESM modules over CommonJS
- Follow best practices
- Write JSDoc comments (likely `/**\n *` or similar)
- Write types, check and follow types. Like TypeScript typings, types, checks and testing of type-safety
- Leverage linters, diagnostics, terminal results and formatters for best results
- Code should be (in order of writing): Easier to read, high performance, secure, DX and functionality
- Keep ONLY ONE version of code in the codebase, re-write to better version. If new version isn't better ask user revert to previous version.
- Run project-wide configured formatters after file creation, modify, changes or delete

Never do:

- Using CommonJS
- Not following best practices
- Leave code undocumented
- Not using linters
- Not using diagnostics
- Not using terminal results
- Not using formatters
- Create multiple versions of same file
- Not using Git
- Skip using formatters after file creation, modify, changes or delete

## Bun

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv.

## Testing

Always use `bun test` to run tests for JS/TS tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

Never do:

- Use other than `bun test` for JS/TS tests

## Benchmark

Always use `vitest` for benchmarking JavaScript and TypeScript code.

Use runtime CPU feature detection for SIMD, SSE or AVX/AVX2/AVX512 for better performance.

Benchmark your code, especially in the performance-critical paths.
Always run benchmark after changing any part of code and report results.

Report benchmark file is: `BENCHMARK.md` (@BENCHMARK.md).
ALWAYS update BENCHMARK.md immediately after running benchmarks.

Never do:

- Use other benchmark frameworks other than `vitest` for JS/TS
- Assume code is fast without measuring
- Hardware acceleration or features unused
- Leave benchmark results outdated
- Forget to document benchmark results

## Dependencies docs

ALWAYS use context7 for documentation and library information:

- Use context7 for fetching library, framework and project documentation information
- Add `use context7` at the end of all prompts when needing documentation
- This ensures up-to-date and accurate information retrieval

Never do:

- Skip `use context7` or skip of `context7` MCP calling

## Do's and Don'ts

Always follow all above instructions, recommendations and rules.
Read twice or more as necessary to follow above instructions.

# Commands

Run from the repository root. As an agent, add `--no-env-file` to Bun commands
(`bun run --no-env-file check-types`).

- `bun install --frozen-lockfile`: install all workspaces from `bun.lock`.
- `bun run check-types`: `tsgo --noEmit` over `packages/` and root JS files.
- `bun run lint`: placeholder that always passes until Biome is configured.
- `bun run --filter <package> test`: run a package's own `test` script (AVA, `node:test`, or `bun test`).
- `bunx vitest bench --run` inside `packages/<name>/benchmark/`: run that package's benchmarks.
- `bun run release`: publishes packages; run only when the user asks.

Definition of Done checks, in this order:

1. Format: no formatter is configured yet; keep the style of the file being edited. Markdown: `rumdl fmt <file>`
   on every changed `.md` file, then `rumdl check <file>`.
2. `bun run check-types`, `bun run lint`, and the tests of every changed package.
3. Benchmarks of every changed performance-critical package, recorded in its `BENCHMARK.md`.
4. The package build (`rollup -c` or its `build` script) when the package has one and its source changed.

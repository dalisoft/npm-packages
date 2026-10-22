# Stack

- Bun workspaces (`packages/*`): independent npm packages published as `@dalisoft/*` or unscoped names. The root
  `package.json` holds shared scripts and dev tools only; `bun.lock` is the committed lockfile.
- Language: ESM JavaScript and TypeScript, type-checked by `tsgo` (TypeScript 7) from the root `tsconfig.json`
  with `allowJs` and `checkJs`. Packages with a build ship their own `tsconfig.json` and `rollup.config.js`.
- Tests: `bun:test` for new and changed tests (shared `areas/tests`). Legacy packages still use AVA (`test.js`) or
  `node:test`; migrate a package's tests only when the task touches them.
- Benchmarks: Vitest bench inside each package's `benchmark/` folder (own `package.json`); results go to that
  package's `BENCHMARK.md` (shared `areas/benchmarks`).
- Lint and format: not configured yet (`lint` is a placeholder). Legacy `eslint.config.js`, `.prettierrc`,
  `.lintstagedrc.js`, and `.huskyrc.js` remain; Biome and rumdl replace them (shared `areas/tooling`).
- Naming: package folders and files are kebab-case, enforced by `.ls-lint.yml`. This overrides the camelCase
  helper names in `areas/typescript`.
- Commits: Conventional Commits with the package name as scope (`.commitlintrc`, lerna scopes), for example
  `fix(tss-env): …`.
- Never touch: `.env*`, `.npmrc`, `dist/` and other build output, `.release-me/`, `.roo/`, `.kilocode/`,
  `.zed/`, `.factory/`, `.vscode/`, and `scripts/`. Edits to `.github/workflows/` need explicit approval.

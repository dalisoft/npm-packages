# AGENTS

Index for humans and AI agents; `CLAUDE.md` only imports it. Shared rules live in `.agents/rules/` (copied from the
rules library, never edited here) and project rules in `.agents/project/`. Claude Code loads both through
`.claude/rules/{shared,project}`: files without frontmatter always, and `areas/` files when a file matching their
`paths` is read or edited. Other agents: read every always-loaded rule at the start, and the matching area rule
before touching its scope.

This is the only `AGENTS.md` in the repository. Do not create or use workspace `AGENTS.md` or `CLAUDE.md` files
under `packages/` unless the user asks; all agent files live at the project root.

## Hard rules

- Do not initialize Git; commit, push, or reset only when asked.
- Never read `.env*` or `.npmrc`; run Bun with `--no-env-file`.
- Never run `bun run release` or publish packages unless asked; `.github/workflows/` edits need approval.

## Always loaded

| Rule                                                                | Owns                                        |
| ------------------------------------------------------------------- | ------------------------------------------- |
| [core/safety](.agents/rules/core/safety.md)                         | Stop conditions, secrets, privacy, guards   |
| [core/git](.agents/rules/core/git.md)                               | Git policy, installs, dependency choices    |
| [core/change-scope](.agents/rules/core/change-scope.md)             | Minimal, in-place changes and cleanup       |
| [core/workflow](.agents/rules/core/workflow.md)                     | Task loop, verification, Definition of Done |
| [core/code-style](.agents/rules/core/code-style.md)                 | Priorities, naming, readable layout         |
| [core/shell](.agents/rules/core/shell.md)                           | Shell use, quoting, processes               |
| [project/stack](.agents/project/stack.md)                           | Required stack, naming, protected paths     |
| [project/commands](.agents/project/commands.md)                     | Scripts and Definition of Done checks       |
| [project/layout](.agents/project/layout.md)                         | Repository tree                             |
| [project/memory/todo](.agents/project/memory/todo.md)               | Current goal, open work, recent evidence    |
| [project/memory/mistakes](.agents/project/memory/mistakes.md)       | Verified failures and their prevention      |
| [project/memory/preferences](.agents/project/memory/preferences.md) | The user's stable choices                   |

## Loaded by path

| Rule                                                          | Scope                                              |
| ------------------------------------------------------------- | -------------------------------------------------- |
| [areas/agent-guidance](.agents/rules/areas/agent-guidance.md) | `AGENTS.md`, `CLAUDE.md`, `.agents/`, `.claude/`   |
| [areas/markdown](.agents/rules/areas/markdown.md)             | `**/*.md`                                          |
| [areas/typescript](.agents/rules/areas/typescript.md)         | TypeScript files and `tsconfig*.json`              |
| [areas/file-size](.agents/rules/areas/file-size.md)           | TS and JS source files                             |
| [areas/bun](.agents/rules/areas/bun.md)                       | `package.json`, `bunfig.toml`, TS and JS files     |
| [areas/tooling](.agents/rules/areas/tooling.md)               | `package.json`, Biome, rumdl, editor and Git files |
| [areas/tests](.agents/rules/areas/tests.md)                   | `tests/`, `*.test.*`                               |
| [areas/benchmarks](.agents/rules/areas/benchmarks.md)         | `*.bench.*`, `bench/`, `BENCHMARK.md`              |

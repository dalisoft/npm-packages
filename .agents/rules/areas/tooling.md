---
paths:
  - "**/package.json"
  - "**/biome.json"
  - "**/biome.jsonc"
  - ".rumdl.toml"
  - ".editorconfig"
  - ".gitignore"
---

# Tooling

- Packages share script names and define only the ones they need: `dev`, `build`, `preview`, `start`, `test`,
  `check-types` (`tsc --noEmit`), `lint`, `lint:md`, and `format` (every formatter with safe fixes).
- Biome lints and formats code; rumdl handles Markdown. Do not add Prettier or ESLint.
- Biome: double quotes, `trailingCommas: "all"`, two-space indent, organized imports; `recommended` rules plus
  `style.useBlockStatements` and `style.noNestedTernary` as errors (and the React hook rules in React projects).
- `.editorconfig`: UTF-8, LF, two spaces, final newline. Each package that reads env ships a `.env.example`.
- `.gitignore` covers dependencies, build output, `.env*` except examples, `DRAFTS/`, logs, and tool caches.

## Latest toolchain

- Every tool stays on its latest release, major versions included: TypeScript (7 or newer), Biome, Vite, rumdl,
  Bun, test and browser tools. Never pin an old major for convenience; `bun outdated` should list nothing.
- When a new major lands, upgrade in its own change: follow the release notes, migrate config and code to the
  current APIs, drop deprecated options, then run the full Definition of Done.
- Build: prefer `Bun.build` and Bun's dev server; use the latest Vite only when the project needs its plugins or
  dev server (TanStack Router or Start, React Fast Refresh), and record that reason in `project/stack`.

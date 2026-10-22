# Layout

The tree is illustrative; `ls packages` is the source of truth.

```tree
.
├── package.json              # Root workspace: shared scripts and dev tools only
├── bun.lock                  # Committed lockfile
├── tsconfig.json             # Root type-check config (allowJs, checkJs, strict)
├── .ls-lint.yml              # kebab-case names under packages/
├── .rumdl.toml               # Markdown lint; MD060 aligned tables
├── .commitlintrc             # Conventional Commits, package names as scopes
├── AGENTS.md, CLAUDE.md      # Agent index; the only pair in the repo (no workspace AGENTS.md)
├── .agents/rules/            # Shared rules, copied from the rules library; never edited here
├── .agents/project/          # Project rules: stack, commands, layout, memory
├── .claude/rules/            # Links `shared` and `project` to the two `.agents` folders
├── DRAFTS/                   # Git-ignored scratch plans and notes for all packages
└── packages/<name>/          # One npm package per folder
    ├── package.json          # Name, exports, scripts
    ├── README.md             # Public docs
    ├── BENCHMARK.md          # Benchmark results (performance packages)
    ├── src/                  # Source (older packages keep sources at the package root)
    ├── tests/ or test.js     # Tests
    ├── benchmark/            # Benchmarks with their own package.json
    └── rollup.config.js      # Build, when the package ships compiled output
```

# Preferences

Stable choices the user made. Topic rules hold the details; this file keeps the reasons visible.

- All agent files live at the project root (`AGENTS.md`, `CLAUDE.md`, `.agents/`, `.claude/`, `DRAFTS/`). No
  workspace `AGENTS.md` or `CLAUDE.md` under `packages/` unless the user asks for one; this overrides the
  workspace bullet in `areas/agent-guidance`.
- Shared rules from the rules library take precedence over older project guidance; when they conflict with an
  existing project setup, follow the shared rule or ask.
- Performance packages: always benchmark before and after a change, use runtime CPU feature detection for SIMD
  (SSE, AVX, AVX2, AVX-512), and update `BENCHMARK.md` right after each run.
- Look up library docs with `context7` when available, otherwise official docs.
- File names are kebab-case everywhere in this project, helpers and utils included (`.ls-lint.yml`); this
  overrides the camelCase helper names in `areas/typescript`.

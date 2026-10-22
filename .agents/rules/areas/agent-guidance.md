---
paths:
  - "**/AGENTS.md"
  - "**/CLAUDE.md"
  - ".agents/**"
  - ".claude/**"
---

# Agent guidance

- `AGENTS.md` is a short index read by every harness: hard rules plus tables of rules with their scopes.
  `CLAUDE.md` only imports it (`@AGENTS.md`).
- Two layers, one topic per file, each under about 30 lines:
  - `.agents/rules/`: shared rules, copied verbatim from the rules library. Never edit them in a project; change
    the library and copy again. Copy only the rules for stacks the project uses.
  - `.agents/project/`: everything tied to this project: `stack`, `commands`, `layout`, `memory/`, and
    project `areas/`. A project rule adds facts; it never repeats a shared rule.
- Files without frontmatter always load. `areas/` files start with `paths:` frontmatter (a YAML list of globs)
  and load only when a matching file is read or edited.
- Claude Code: `.claude/rules/` is a folder with two links, `shared -> ../../.agents/rules` and
  `project -> ../../.agents/project`. Keep link targets inside the project; Claude Code holds back rules linked
  from outside it.
- Workspaces in a monorepo have their own `AGENTS.md` (linking to the root one) and `CLAUDE.md` importing it.
  Claude Code loads the root `CLAUDE.md` always, and a workspace one when it works on files there. Put a fact in
  the narrowest place: a workspace `AGENTS.md` for the whole workspace, an `areas/` rule for a smaller scope.
- One fact lives in one place. Update the `AGENTS.md` tables when a rule is added, renamed, or rescoped.
- `project/memory/`: `todo.md` (goal, open work, evidence), `mistakes.md` (verified recurring failures; when
  the user corrects a pattern a third time, ask `ADD THIS MISTAKE?`), `preferences.md` (stable user choices).
  Never store secrets, personal data, raw transcripts, or large logs in them. A mistake whose prevention is
  reusable becomes a shared rule instead.

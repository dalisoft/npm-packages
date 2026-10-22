# Todo

Current goal, open work, and recent evidence. Keep it short: replace stale entries instead of appending. Statuses:
`[ ]` pending, `[~]` in progress, `[x]` verified with evidence, `[!]` blocked with the blocker. This file is committed
and outlives tasks; per-task scratch plans live in `DRAFTS/` (see `core/workflow`).

## Current

- Goal: none active.
- Next action: pick from Open.

## Open

- [ ] Configure Biome and rumdl (`lint`, `lint:md`, `format` scripts); remove the legacy ESLint, Prettier,
  Husky, and lint-staged configs.
- [ ] Modernize the root `tsconfig.json` (ESNext modules, Bundler resolution, `isolatedModules`) per
  `areas/typescript`.
- [ ] Move `release` off pnpm to Bun.
- [ ] fast-node-parse: multi-route matching, see `DRAFTS/fast-node-parse-goal.md`.

## Recently verified

- [x] Agent rules installed from the rules library; old `AGENTS.md` and `ARCHITECTURE.md` merged into
  `.agents/project/`.

---
paths:
  - "**/package.json"
  - "**/bunfig.toml"
  - "**/bun.lock"
  - "**/*.{ts,tsx,js,jsx}"
---

# Bun

- Use Bun instead of Node and npm: `bun <file>`, `bun run <script>`, `bunx`, and `bun test`. No `ts-node`,
  `dotenv`, Jest, or extra bundlers.
- As an agent, run Bun with `--no-env-file` (`bun run --no-env-file test`); Bun loads `.env` files otherwise.
- Install with `bun install --frozen-lockfile`; keep the committed `bun.lock`. Workspaces use the isolated linker
  (`bunfig.toml`) and the root drives them with `bun run --filter`.
- Prefer Bun and platform built-ins (`Bun.file`, `Bun.hash`, `URL.parse`, `crypto.randomUUID`) over packages.

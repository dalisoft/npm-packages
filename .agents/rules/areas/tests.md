---
paths:
  - "**/tests/**"
  - "**/*.test.{ts,tsx,js,jsx}"
---

# Tests

- Add a regression test for every behaviour change, and test pure helpers directly.
- Use the project's runner, single pass with no watch mode: `bun:test` (`describe`, `test`, `expect`) in Bun
  projects. Name files `*.test.ts[x]` under the package's `tests/` folder.
- Tests never touch personal or production data: point them at a temporary data directory and an isolated server
  on a random loopback port.
- Do not name test helpers `use*`; hook lint rules flag them. Use verbs such as `startTestServer`.
- Update snapshots or goldens only for an intended change, and say so in the report.

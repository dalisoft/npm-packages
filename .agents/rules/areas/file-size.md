---
paths:
  - "**/*.{ts,tsx,js,jsx,mts,cts}"
---

# File size

- **Lines:** a source file stays at 100 lines or fewer; 150 is the hard limit.
- **Functions:** one module-level function per file ideally, two on average, three at most. Count `function`
  declarations and `const` arrow or function expressions at module level, including the exported component or
  hook. Callbacks inside a function do not count; test files count helpers, not `test()` blocks.
- Generated files and authored data are exempt; `project/stack` names them and the test that enforces the limits.

Split by responsibility, in this order:

1. Network calls (`fetch`, URLs, timeouts) into the API layer as typed functions.
2. Pure calculations into `helpers/`; browser or runtime wiring (storage, media, feature checks) into `utils/`.
3. Each self-contained state machine into its own hook, named for what it owns (`useCountdown`).
4. Each visual section into a sub-component in the component folder, sharing its stylesheet.
5. Several functions about one subject: make the module a folder with one function per file and a barrel
   `index.ts`, so callers keep their import path.
6. If the rest is an orchestrator whose lifecycle reads best in one place, stop at 150 lines and say so.

Re-run type checks, lint, and the tests after each split file.

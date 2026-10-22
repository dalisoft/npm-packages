# ARCHITECTURE

Canonical system shape for npm packages workspaces. Update only when responsibilities change.

## Safety protocol

Refer to `AGENTS.md` for safety protocol

## Dependency overview

| Name   | Kind  | Description              | Dependency |
| ------ | ----- | ------------------------ | ---------- |
| vitest | Tests | Unit, integration, bench | dev        |

- ESM only; no CommonJS.
- New runtime dependencies require PR justification (need, size, alternatives).

## Directory layout

```tree
.
├── AGENTS.md
├── ARCHITECTURE.md
├── bun.lock
├── eslint.config.js
├── LICENSE
├── node_modules
├── package.json
├── packages
│   ├── args
│   │   ├── args.d.ts
│   │   ├── args.es.js
│   │   ├── package.json
│   │   ├── README.md
│   │   └── test.js
│   ├── as-batch
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── rollup.config.js
│   │   ├── src
│   │   │   └── as-batch.ts
│   │   ├── test.js
│   │   └── tsconfig.json
│   ├── batch-collect
│   │   ├── batch-collect.d.ts
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── rollup.config.js
│   │   ├── src
│   │   │   └── batch-collect.js
│   │   └── test.js
│   ├── batch-do
│   │   ├── batch-do.d.ts
│   │   ├── cjs.js
│   │   ├── esm.js
│   │   ├── examples
│   │   │   └── layout-trashing.html
│   │   ├── package.json
│   │   └── README.md
│   ├── cache-ttl
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── rollup.config.js
│   │   ├── src
│   │   │   ├── cache.ts
│   │   │   ├── create-cache-custom.ts
│   │   │   ├── create-cache-file.ts
│   │   │   └── pool.ts
│   │   ├── test.js
│   │   └── tsconfig.json
│   ├── cookie
│   │   ├── cookie.js
│   │   ├── package.json
│   │   ├── README.md
│   │   └── test.js
│   ├── deepcopy
│   │   ├── deepcopy.js
│   │   ├── package.json
│   │   ├── README.md
│   │   └── test.js
│   ├── easy2pdf
│   │   ├── examples
│   │   │   ├── foo.md
│   │   │   └── foo.md.pdf
│   │   ├── node_modules
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── src
│   │   │   ├── api.js
│   │   │   ├── cli.js
│   │   │   ├── parsers
│   │   │   └── pdf.js
│   │   └── tsconfig.json
│   ├── events
│   │   ├── event.d.ts
│   │   ├── event.es.js
│   │   ├── node_modules
│   │   ├── package.json
│   │   ├── README.md
│   │   └── test.js
│   ├── fast-node-parse
│   │   ├── benchmark
│   │   │   ├── 3lvl-depth.js
│   │   │   ├── bun.lockb
│   │   │   ├── depth.js
│   │   │   ├── fast-tree.ts
│   │   │   ├── node_modules
│   │   │   ├── nodes.js
│   │   │   ├── package.json
│   │   │   ├── radix-tree.ts
│   │   │   ├── route-fast.ts
│   │   │   ├── static.js
│   │   │   ├── types.d.ts
│   │   │   ├── vitest
│   │   │   └── wired.js
│   │   ├── BENCHMARK.md
│   │   ├── examples
│   │   │   └── cases.ts
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── src
│   │   │   ├── node.d.ts
│   │   │   └── node.js
│   │   ├── tests
│   │   │   ├── compact.test.js
│   │   │   └── tree.test.js
│   │   └── utils
│   │       ├── compact.d.ts
│   │       └── compact.js
│   ├── fast-path-parse
│   │   ├── benchmark
│   │   │   ├── bench-vitest.bench.js
│   │   │   ├── bench.js
│   │   │   ├── bun.lock
│   │   │   ├── node_modules
│   │   │   ├── package.json
│   │   │   ├── path-compare.js
│   │   │   ├── path-parse.js
│   │   │   └── validate-parse.js
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── src
│   │   │   ├── aot
│   │   │   ├── runtime
│   │   │   └── utils
│   │   ├── tests
│   │   │   ├── data
│   │   │   ├── helpers.js
│   │   │   ├── match-safe.test.js
│   │   │   ├── match-unsafe.test.js
│   │   │   ├── parse-safe.test.js
│   │   │   ├── parse-unsafe.test.js
│   │   │   └── segment.test.js
│   │   └── tsconfig.json
│   ├── fast-pool
│   │   └── pool.ts
│   ├── fast-query-parse
│   │   ├── benchmark
│   │   │   ├── node_modules
│   │   │   ├── package.json
│   │   │   └── qs-parse.js
│   │   ├── node_modules
│   │   ├── package.json
│   │   ├── parse.js
│   │   └── README.md
│   ├── getdirname
│   │   ├── cjs.js
│   │   ├── esm.mjs
│   │   ├── package.json
│   │   └── README.md
│   ├── gsheet-ql
│   │   ├── examples
│   │   │   └── demo.ts
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── rollup.config.js
│   │   ├── src
│   │   │   ├── _class.ts
│   │   │   ├── helpers
│   │   │   ├── methods
│   │   │   └── ts-interfaces.ts
│   │   └── tsconfig.json
│   ├── json-strify
│   │   ├── benchmark
│   │   │   └── bench.js
│   │   ├── json-strify.js
│   │   ├── node_modules
│   │   ├── package.json
│   │   ├── README.md
│   │   └── test.js
│   ├── jwe
│   │   ├── node_modules
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── rollup.config.js
│   │   ├── src
│   │   │   ├── decode.js
│   │   │   ├── jwe.js
│   │   │   ├── sign.js
│   │   │   └── verify.js
│   │   └── test.js
│   ├── jwt
│   │   ├── dist
│   │   │   └── es
│   │   ├── node_modules
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── rollup.config.js
│   │   ├── src
│   │   │   ├── decode.ts
│   │   │   ├── gen-token.ts
│   │   │   ├── jwt.ts
│   │   │   ├── sign.ts
│   │   │   ├── utils.ts
│   │   │   └── verify.ts
│   │   ├── test.js
│   │   └── tsconfig.json
│   ├── lib-export
│   │   ├── ast
│   │   │   ├── clean-ast.js
│   │   │   ├── exports-ast.js
│   │   │   ├── imports-ast.js
│   │   │   ├── index.js
│   │   │   └── regexp.js
│   │   ├── cli.js
│   │   ├── lib.js
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── template.js
│   │   └── test
│   │       └── simple.js
│   ├── macos-antialias-configure
│   │   ├── cli.js
│   │   ├── package.json
│   │   └── README.md
│   ├── microserver
│   │   ├── CODE_OF_CONDUCT.md
│   │   ├── esm
│   │   │   ├── body.js
│   │   │   ├── config.js
│   │   │   ├── cookies.js
│   │   │   ├── headers.js
│   │   │   ├── index.js
│   │   │   ├── json.js
│   │   │   ├── legacy.js
│   │   │   ├── middleware.js
│   │   │   ├── params.js
│   │   │   ├── pipe.js
│   │   │   ├── query.js
│   │   │   ├── sendFile.js
│   │   │   ├── stream.js
│   │   │   └── utils
│   │   ├── examples
│   │   │   └── json
│   │   ├── node_modules
│   │   ├── package.json
│   │   ├── README.md
│   │   └── rollup.config.js
│   ├── mobx-sync-storage
│   │   ├── mobx-sync-storage.d.ts
│   │   ├── mobx-sync-storage.js
│   │   ├── package.json
│   │   └── README.md
│   ├── points.js
│   │   ├── index.js
│   │   ├── node_modules
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── rollup.config.js
│   │   └── src
│   ├── react-es6-tween
│   │   ├── example.html
│   │   ├── package.json
│   │   ├── react-es6-tween.js
│   │   └── README.md
│   ├── sequelize-wrap
│   │   ├── node_modules
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── sequelize-wrap.d.ts
│   │   └── sequelize-wrap.js
│   ├── simd-path
│   │   ├── _class.ts
│   │   ├── lib.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── swipe-gesture
│   │   ├── package.json
│   │   ├── README.md
│   │   └── swipe-gesture.es.js
│   ├── ts-env
│   │   ├── auto.js
│   │   ├── lib.d.ts
│   │   ├── lib.js
│   │   ├── package.json
│   │   └── README.md
│   ├── ws-events-sync
│   │   ├── demos
│   │   │   ├── index.html
│   │   │   ├── package.json
│   │   │   └── server.js
│   │   ├── node_modules
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── test.js
│   │   ├── ws-events-sync.d.ts
│   │   └── ws-events-sync.js
│   └── yt-comments
│       ├── comments.js
│       ├── comments.json
│       ├── node_modules
│       └── package.json
└── tsconfig.json

```

### Naming & placement

- Files: dash-case directories/files (`packages/fast-path-parse`).
- Tests: `*.test.ts[x]` colocated with source or under `tests/unit`.

## Primitives & policies

-

## Module responsibilities

-

## TypeScript config

## Data & flow

-

## Error handling & logging

- Report errors

## Performance & a11y budgets (advisory)

- Always benchmark JavaScript and TypeScript code.
- Use runtime CPU feature detection for SIMD, SSE or AVX/AVX2/AVX512 for better performance.
- Always run benchmark after changing any part of code and report results.
- Report benchmark file is: `BENCHMARK.md`.
- ALWAYS update BENCHMARK.md immediately after running benchmarks.

## Testing

- [Unit/integration](#dependency-overview) (`bun run test`; `import { describe, it, expect } from 'vitest'`)

## CI & gates

- Typecheck, lint/format, unit/integration, benchmark, coverage (if configured).

## Change policy

- Do not change this file's structure or the directory layout without team approval.

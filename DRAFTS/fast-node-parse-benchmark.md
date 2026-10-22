# Benchmark Notes

## 2026-06-03 Node Before/After

Command:

```bash
benchmark/node_modules/.bin/vitest bench benchmark/vitest/node-before-after.bench.js --run
```

Runtime:

- Node.js v24.11.0 through Vitest v4.0.16
- Vitest bench config: 1,000,000 iterations and 1,000 warmup iterations

| Case       | Operation |           Before |            After | Result                 |
| ---------- | --------- | ---------------: | ---------------: | ---------------------- |
| `/foo`     | match     | 21,614,665 ops/s | 25,441,013 ops/s | after +17.9%           |
| `/foo`     | parse     | 22,410,597 ops/s | 24,980,155 ops/s | after +11.5%           |
| `/foo`     | lookup    |  2,732,422 ops/s |  4,857,887 ops/s | after +77.8%, high RME |
| `/foo/:id` | match     | 11,462,420 ops/s |  5,983,458 ops/s | after -47.8%           |
| `/foo/:id` | parse     | 14,839,054 ops/s |  8,307,058 ops/s | after -44.0%           |
| `/foo/:id` | lookup    | 15,140,987 ops/s |  8,826,608 ops/s | after -41.7%           |

Comparator leaders from the same run:

- Static match: `fast-path-parse[-runtime]` at 33,477,169 ops/s.
- Static parse: `extreme-router` at 27,650,745 ops/s.
- Static lookup: `extreme-router` at 16,211,549 ops/s.
- Param match/parse/lookup: previous `fast-node-parse-before` remained fastest.

Notes:

- The current `children + next` implementation improves static route performance.
- The current dynamic route hot path regresses versus the previous single-chain implementation.
- Static lookup had high RME in several competitors, so use that row directionally.

## 2026-06-03 Node Optimization Pass

Command:

```bash
benchmark/node_modules/.bin/vitest bench benchmark/vitest/node-before-after.bench.js --run
```

Changes measured:

- Added numeric node `kind` to avoid repeated static/key classification in walk methods.
- Added cached `terminal` flag maintained by `push()`.
- Added a param terminal-leaf shortcut that still falls through to wildcard siblings.
- Restored `startsWith()` for static segment checks after `indexOf()` regressed static routes.
- Expanded benchmark to include:
  - static `/foo`
  - legacy one-node before-shape `/foo/:id`
  - semantic segmented `/foo/:id/:kind`

| Case                           | Operation |           Before |            After | Result                 |
| ------------------------------ | --------- | ---------------: | ---------------: | ---------------------- |
| `/foo`                         | match     | 21,722,573 ops/s | 24,541,103 ops/s | after +13.0%           |
| `/foo`                         | parse     | 22,694,334 ops/s | 25,035,620 ops/s | after +10.3%           |
| `/foo`                         | lookup    | 17,455,339 ops/s | 17,209,534 ops/s | after -1.4%            |
| `/foo/:id` legacy before-shape | match     | 24,718,118 ops/s | 18,581,852 ops/s | after -24.8%           |
| `/foo/:id` legacy before-shape | parse     | 18,952,372 ops/s | 12,332,076 ops/s | after -34.9%           |
| `/foo/:id` legacy before-shape | lookup    | 13,529,280 ops/s |  8,450,595 ops/s | after -37.5%           |
| `/foo/:id/:kind` segmented     | match     | 11,464,518 ops/s | 11,500,914 ops/s | after +0.3%, high RME  |
| `/foo/:id/:kind` segmented     | parse     |  8,485,083 ops/s |  9,150,833 ops/s | after +7.8%            |
| `/foo/:id/:kind` segmented     | lookup    |  4,161,847 ops/s |  5,233,246 ops/s | after +25.7%, high RME |

Notes:

- The weakest comparable path was segmented dynamic `match`; after optimization it is roughly tied/slightly faster than the backup while preserving stricter path-end validation.
- The legacy one-param before row is not the same tree shape: backup stores `foo/:id` as one dynamic node, while the GOAL implementation stores `foo` and `:id` as separate `children` nodes.
- `match`, `parse`, and `lookup` still each contain exactly one `while` loop. The additional `while` loop is only in `push()` for sibling insertion.

## 2026-06-03 GOAL-Shape Final Run

Command:

```bash
benchmark/node_modules/.bin/vitest bench benchmark/vitest/node-before-after.bench.js --run
```

Changes measured:

- Implemented `children` + `next` sibling traversal for multi-route support.
- Added cached node shape fields (`kind`, `leaf`, `terminal`, fast single-child caches).
- Switched static segment validation from `startsWith()` to exact-position `indexOf()` plus slash `charCodeAt()`.
- Split `match()` into a small fast-path front end and `matchWalk()` for the single fallback loop.
- Updated the one-param benchmark to use the GOAL-style segmented route shape.

| Case                       | Operation |           Before |            After | Result       |
| -------------------------- | --------- | ---------------: | ---------------: | ------------ |
| `/foo`                     | match     | 22,637,617 ops/s | 28,114,138 ops/s | after +24.2% |
| `/foo`                     | parse     | 23,594,618 ops/s | 28,002,987 ops/s | after +18.7% |
| `/foo`                     | lookup    | 17,381,596 ops/s | 18,095,899 ops/s | after +4.1%  |
| `/foo/:id` segmented       | match     | 18,062,118 ops/s | 16,768,107 ops/s | after -7.2%  |
| `/foo/:id` segmented       | parse     | 16,839,470 ops/s | 12,491,477 ops/s | after -25.8% |
| `/foo/:id` segmented       | lookup    | 16,074,486 ops/s |  8,690,788 ops/s | after -45.9% |
| `/foo/:id/:kind` segmented | match     | 14,937,888 ops/s | 14,392,794 ops/s | after -3.6%  |
| `/foo/:id/:kind` segmented | parse     |  9,181,764 ops/s |  8,892,446 ops/s | after -3.2%  |
| `/foo/:id/:kind` segmented | lookup    |  6,636,534 ops/s |  5,745,969 ops/s | after -13.4% |

Notes:

- Static routes are now faster than the backup across all measured methods.
- Dynamic routes remain slower than the backup. The backup walker is a single-route chain and does less validation; the current implementation enforces stricter segment boundaries and supports sibling routes.
- This run does not satisfy the target that every method must be at least as fast as the previous implementation.

## 2026-06-03 Slashed Cache + Split Walkers

Command:

```bash
benchmark/node_modules/.bin/vitest bench benchmark/vitest/node-before-after.bench.js --run
```

Changes measured since the previous final run:

- Reintroduced a static `slashed` cache and used exact-position `indexOf(slashed)` for non-terminal static segment checks.
- Split `parse()` and `lookup()` into small fast-path front ends plus `parseWalk()` / `lookupWalk()` fallback loops.
- Added a direct `lookup()` fast path for single static child routes with one or two param children.

| Case                       | Operation |           Before |            After | Result       |
| -------------------------- | --------- | ---------------: | ---------------: | ------------ |
| `/foo`                     | match     | 22,713,955 ops/s | 27,292,327 ops/s | after +20.2% |
| `/foo`                     | parse     | 22,719,776 ops/s | 27,892,338 ops/s | after +22.8% |
| `/foo`                     | lookup    | 17,412,056 ops/s | 20,214,703 ops/s | after +16.1% |
| `/foo/:id` segmented       | match     | 18,500,501 ops/s | 17,659,843 ops/s | after -4.5%  |
| `/foo/:id` segmented       | parse     | 17,202,154 ops/s | 12,069,061 ops/s | after -29.8% |
| `/foo/:id` segmented       | lookup    | 16,222,968 ops/s |  8,947,735 ops/s | after -44.8% |
| `/foo/:id/:kind` segmented | match     | 14,956,179 ops/s | 14,061,604 ops/s | after -6.0%  |
| `/foo/:id/:kind` segmented | parse     |  8,851,040 ops/s |  9,306,917 ops/s | after +5.2%  |
| `/foo/:id/:kind` segmented | lookup    |  6,287,744 ops/s |  5,959,112 ops/s | after -5.2%  |

Notes:

- Static route performance improved further, especially `lookup`.
- The comparable two-param dynamic parse path is now faster than the backup.
- Dynamic `match` and `lookup` still miss parity.
- The `/foo/:id` segmented row is not semantically comparable: the backup segmented chain returns `false` for `/foo/bar`, while the current implementation correctly matches/parses it.

## 2026-06-03 Root Static Cache Follow-Up

Command:

```bash
benchmark/node_modules/.bin/vitest bench benchmark/vitest/node-before-after.bench.js --run
```

Changes measured since the previous run:

- Cached root static child `slashed` segment and end offset (`fastStaticSlashed`, `fastStaticEnd`) during `refresh()`.
- Reused those cached fields in root-level dynamic `match()` and `lookup()` fast paths.

| Case                       | Operation |           Before |            After | Result                        |
| -------------------------- | --------- | ---------------: | ---------------: | ----------------------------- |
| `/foo`                     | match     | 28,705,493 ops/s | 34,471,194 ops/s | after +20.1%, high RME        |
| `/foo`                     | parse     | 26,669,792 ops/s | 35,498,550 ops/s | after +33.1%                  |
| `/foo`                     | lookup    | 21,121,319 ops/s | 24,725,807 ops/s | after +17.1%                  |
| `/foo/:id` segmented       | match     | 21,863,003 ops/s | 21,750,079 ops/s | after -0.5%, high RME         |
| `/foo/:id` segmented       | parse     | 21,467,928 ops/s | 14,616,260 ops/s | after -31.9%                  |
| `/foo/:id` segmented       | lookup    | 20,298,106 ops/s | 10,246,156 ops/s | after -49.5%                  |
| `/foo/:id/:kind` segmented | match     | 15,948,285 ops/s | 19,255,044 ops/s | after +20.7%, before high RME |
| `/foo/:id/:kind` segmented | parse     | 10,638,964 ops/s | 11,091,057 ops/s | after +4.2%                   |
| `/foo/:id/:kind` segmented | lookup    |  7,376,079 ops/s |  7,420,580 ops/s | after +0.6%                   |

Notes:

- The two-param dynamic case is now at or above the backup across `match`, `parse`, and `lookup`.
- Static routes remain faster across all methods.
- The one-param segmented benchmark still should not be treated as a valid before/after comparison because the backup returns `false` for the same valid route.

## 2026-06-03 Competitor Results

The earlier sections intentionally kept the main benchmark table focused on
`fast-node-parse` before/after deltas. The competitor rows are recorded
separately here so the optimization target and the external comparison do not
hide each other.

Command:

```bash
benchmark/node_modules/.bin/vitest bench benchmark/vitest/node-before-after.bench.js --run
```

Notes:

- Values are ops/s from the same focused benchmark harness.
- `fast-path-parse` is measured only for `match` in this harness.
- `find-my-way` is measured for `match` and `lookup`; parse-only extraction is
  not a separate benchmark row.
- The `param-medium match` row had a high-RME outlier for
  `fast-node-parse-after`, so use that particular row directionally.

| Case                       | Operation |        fast-tree | fast-path-parse runtime | fast-path-parse aot |       hono-regex |       hono-trie |      find-my-way |   extreme-router |
| -------------------------- | --------- | ---------------: | ----------------------: | ------------------: | ---------------: | --------------: | ---------------: | ---------------: |
| `/foo`                     | match     | 18,098,365 ops/s |        33,244,760 ops/s |    32,561,782 ops/s | 23,541,534 ops/s | 6,278,607 ops/s | 20,593,543 ops/s | 27,688,061 ops/s |
| `/foo`                     | parse     | 17,451,577 ops/s |                     n/a |                 n/a | 23,537,168 ops/s | 6,235,612 ops/s |              n/a | 27,778,687 ops/s |
| `/foo`                     | lookup    | 14,474,488 ops/s |                     n/a |                 n/a | 23,097,708 ops/s | 6,378,544 ops/s | 17,143,756 ops/s | 27,506,164 ops/s |
| `/foo/:id` segmented       | match     |  4,932,327 ops/s |        15,070,862 ops/s |    16,695,427 ops/s | 10,584,389 ops/s | 1,786,049 ops/s |  8,697,224 ops/s |  3,368,439 ops/s |
| `/foo/:id` segmented       | parse     |  4,694,148 ops/s |                     n/a |                 n/a | 11,520,170 ops/s | 1,759,352 ops/s |              n/a |  3,370,721 ops/s |
| `/foo/:id` segmented       | lookup    |  4,387,390 ops/s |                     n/a |                 n/a | 10,650,797 ops/s | 1,638,345 ops/s |  6,933,400 ops/s |  3,126,538 ops/s |
| `/foo/:id/:kind` segmented | match     |  3,862,204 ops/s |        12,197,672 ops/s |    13,072,099 ops/s | 10,124,450 ops/s | 1,617,111 ops/s |  5,715,987 ops/s |  6,829,143 ops/s |
| `/foo/:id/:kind` segmented | parse     |  3,702,646 ops/s |                     n/a |                 n/a | 10,887,034 ops/s | 1,602,056 ops/s |              n/a |  6,850,401 ops/s |
| `/foo/:id/:kind` segmented | lookup    |  3,122,488 ops/s |                     n/a |                 n/a | 10,524,607 ops/s | 1,520,036 ops/s |  5,400,262 ops/s |  6,856,570 ops/s |

## 2026-06-03 Router Export + Mixed-Shape Follow-Up

Commands:

```bash
node --test
benchmark/node_modules/.bin/vitest bench benchmark/vitest/node-before-after.bench.js --run
benchmark/node_modules/.bin/vitest bench benchmark/vitest/node-before-after.bench.js --run -t "param-medium"
```

Changes measured since the previous run:

- Inlined the `match()` fast path and kept `matchWalk()` as the single
  loop-bearing fallback.
- Cached the root static child offset as the first param start.
- Moved root static fast paths ahead of legacy one-node handling.
- Reordered the two-param grandchild check in root fast paths.
- Added the `Router` export already declared by `src/node.d.ts`.
- Fixed sibling fallback for nonterminal exact static/param matches.

Full mixed-shape run:

| Case                       | Operation |            Before |             After | Result                         |
| -------------------------- | --------- | ----------------: | ----------------: | ------------------------------ |
| `/foo`                     | match     | 28,961,359 ops/s  | 30,692,316 ops/s  | after +6.0%, after high RME    |
| `/foo`                     | parse     | 29,189,464 ops/s  | 35,823,020 ops/s  | after +22.7%                   |
| `/foo`                     | lookup    | 21,040,194 ops/s  | 25,106,592 ops/s  | after +19.3%                   |
| `/foo/:id` segmented       | match     | 23,623,079 ops/s  | 22,970,433 ops/s  | after -2.8%, not comparable    |
| `/foo/:id` segmented       | parse     | 22,174,614 ops/s  | 15,510,716 ops/s  | after -30.1%, not comparable   |
| `/foo/:id` segmented       | lookup    | 20,829,404 ops/s  | 11,041,845 ops/s  | after -47.0%, not comparable   |
| `/foo/:id/:kind` segmented | match     | 18,657,780 ops/s  | 19,135,583 ops/s  | after +2.6%                    |
| `/foo/:id/:kind` segmented | parse     | 10,772,552 ops/s  | 11,018,053 ops/s  | after +2.3%                    |
| `/foo/:id/:kind` segmented | lookup    |  7,542,522 ops/s  |  7,241,236 ops/s  | after -4.0%, still below target |

Focused two-param run:

| Case                       | Operation |           Before |            After | Result       |
| -------------------------- | --------- | ---------------: | ---------------: | ------------ |
| `/foo/:id/:kind` segmented | match     | 14,038,909 ops/s | 15,164,887 ops/s | after +8.0%  |
| `/foo/:id/:kind` segmented | parse     |  8,778,933 ops/s |  9,955,174 ops/s | after +13.4% |
| `/foo/:id/:kind` segmented | lookup    |  6,444,532 ops/s |  6,817,964 ops/s | after +5.8%  |

Notes:

- Full `node --test` passes, including the router tests.
- The focused comparable route family is now above the backup on all three
  methods.
- The full mixed-shape run still has `param-medium lookup` below the backup, so
  the overall performance goal remains incomplete.
- The one-param segmented row is still not semantically comparable: the backup
  returns `false` for `/foo/bar`, while the current implementation correctly
  matches and parses it.

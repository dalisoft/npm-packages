# fast-node-parse

Fastest route node walker with three main essentials: `match`, `parse` and `lookup`.

## Features

- Zero dependency
- Zero config
- Fastest parser

## Usage

See [examples](./examples) or [benchmark](./benchmark) folder to see how it's could be used.

## Benchmark

It is on my machine, on your machine results may vary

### Static

| Runtime | Path   | Methods  | `fast-node` | `hono-regexp` | `find-my-way` |
| ------- | ------ | -------- | ----------- | ------------- | ------------- |
| Node.js | `/foo` | `match`  | `73M ops`   | `73M ops`     | `43.5M ops`   |
| Bun     | `/foo` | `match`  | `50M ops`   | `118M ops`    | `21M ops`     |
| Node.js | `/foo` | `parse`  | `74M ops`   | `66M ops`     | `44M ops`     |
| Bun     | `/foo` | `parse`  | `51M ops`   | `82M ops`     | `20M ops`     |
| Node.js | `/foo` | `lookup` | `32M ops`   | `49.5M ops`   | `42M ops`     |
| Bun     | `/foo` | `lookup` | `29.5M ops` | `72.5M ops`   | `14.5M ops`   |

### 3-level parameter

| Runtime | Path             | Methods  | `fast-node` | `hono-regexp` | `find-my-way` |
| ------- | ---------------- | -------- | ----------- | ------------- | ------------- |
| Node.js | `/foo/:id/:kind` | `match`  | `32M ops`   | `16M ops`     | `7.5M ops`    |
| Bun     | `/foo/:id/:kind` | `match`  | `36M ops`   | `12.5M ops`   | `6.5M ops`    |
| Node.js | `/foo/:id/:kind` | `parse`  | `14.5M ops` | `15M ops`     | `7.5M ops`    |
| Bun     | `/foo/:id/:kind` | `parse`  | `19.5M ops` | `11.5M ops`   | `6.5M ops`    |
| Node.js | `/foo/:id/:kind` | `lookup` | `4.5M ops`  | `6.5M ops`    | `4M ops`      |
| Bun     | `/foo/:id/:kind` | `lookup` | `8M ops`    | `8M ops`      | `4.5M ops`    |

## Supported paths

### Information about badges

- ✅ – Done
- ✍️ – In progress
- 🕖 – Planned but not started yet
- ⚠️ – Requires high amount of time
- ？– Not tested but could work
- ❌ – Probably does not happen

| Name                 | Status |
| -------------------- | ------ |
| `/foo`               | ✅     |
| `/foo/bar`           | ✅     |
| `/foo/bar-{one,two}` | ⚠️     |
| `/foo/bar-[one,two]` | ⚠️     |
| `/foo/bar_*`         | ❌     |
| `/foo/bar-*`         | ❌     |
| `/foo/bar*`          | ❌     |
| `/foo/bar/<id>`      | ❌     |
| `/foo/task/:bar`     | ✅     |
| `/foo/:task/:bar`    | ✅     |
| `/foo/:bar`          | ✅     |
| `/foo/*`             | ✅     |
| `/foo/(.*)`          | ❌     |

## License

MIT

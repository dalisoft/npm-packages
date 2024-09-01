# fast-path-parse

Fastest route path-to-params parser.

Optimized where it's possible.

Up-to **10x** faster than fastest counterpart (`aot` imports)

## Features

- Zero dependency
- Zero config
- Fastest parser

## Usage

### ESM

```js
import parse from 'fast-path-parse/runtime/parse';
// or
import parse from 'fast-path-parse/aot/parse';

// Run this ahead-of-time, not at runtime or hot path
const parsePath = parse('/user/:foo');

// Run this at hot path
parsePath('/user/john');
```

### CJS

```js
const parse = require('fast-path-parse/runtime/parse');
// or
const parse = require('fast-path-parse/aot/parse');

// Run this ahead-of-time, not at runtime or hot path
const parsePath = parse('/user/:foo');

// Run this at hot path
parsePath('/user/john');
```

## Supported paths

### Information about badges

- ✅ – Done
- ✍️ – In progress
- 🕖 – Planned but not started yet
- ⚠️ – Requires high amount of time
- ？– Not tested but could work
- ❌ – Probably does not happen

| Name                 | Status | Priority | Performance |
| -------------------- | ------ | -------- | ----------- |
| `/foo`               | ✅     | 0        | 100%        |
| `/foo/bar`           | ✅     | 0        | 100%        |
| `/foo/bar-{one,two}` | ⚠️     | 1        | 60%         |
| `/foo/bar-[one,two]` | ⚠️     | 1        | 60%         |
| `/foo/bar_*`         | ⚠️     | 2        | 80%         |
| `/foo/bar-*`         | ⚠️     | 2        | 80%         |
| `/foo/bar*`          | ⚠️     | 2        | 80%         |
| `/foo/bar/<id>`      | ✅     | 3        | 90%         |
| `/foo/task/:bar`     | ✅     | 4        | 80%         |
| `/foo/:task/:bar`    | ✅     | 4        | 70%         |
| `/foo/:bar`          | ✅     | 5        | 90%         |
| `/foo/*`             | ✅     | 6        | 90%         |
| `/foo/(.*)`          | ✅     | 6        | 90%         |

## License

MIT

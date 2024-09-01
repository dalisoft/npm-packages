# fast-path-parse

Fastest route path-to-params parser.

Optimized where it's possible.

Up-to **2x** faster than fastest counterpart (`compile` method)

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

## License

MIT

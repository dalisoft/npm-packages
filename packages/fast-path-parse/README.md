# fast-path-parse

Fastest route path-to-params parser.

Up-to **2x** faster than fastest counterpart (`compile` method)

## Features

- Zero dependency
- Fastest parser

## Usage

### ESM

```js
import parse from 'fast-path-parse/parse';
// or
import parse from 'fast-path-parse/compile';

// Run this ahead-of-time, not at runtime or hot path
const parsePath = parse('/user/:foo');

// Run this at hot path
parsePath('/user/john');
```

### CJS

```js
const parse = require('fast-path-parse/parse');
// or
const parse = require('fast-path-parse/compile');

// Run this ahead-of-time, not at runtime or hot path
const parsePath = parse('/user/:foo');

// Run this at hot path
parsePath('/user/john');
```

## License

MIT

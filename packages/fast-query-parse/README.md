# fast-query-parse

The fastest query parser. Up to 10x faster than `require('qs').parse`

## Features

- Zero dependency
- Fast
- Auto-decode URL
- Auto-mapping

## Usage

### ESM

```js
import parse from 'fast-query-parse';

parse('foo=bar');
```

### CJS

```js
const parse = require('fast-query-parse');

parse('foo=bar');
```

## License

MIT

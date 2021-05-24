# fast-query-parse

The fastest query parser. Up to 2x faster than `querystring.parse`

## Features

- Zero dependency
- Fast
- Auto-decode URL

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

# fast-query-parse

Most fastest `query parse` with performance of `querystring` module and features of `qs` module

## Features

- Zero dependency
- Fast
- Auto-decode URL
- Auto-mapping

## Caveats

`require('qs')` is able to deep parse up-to 5-level depth of array and objects whereas `fast-query-parse` cannot do this as can parse only 1-level depth and results goes wrong if depth more than one

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

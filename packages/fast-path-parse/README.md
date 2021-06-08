# fast-path-parse

Most fastest path parser

## Features

- Zero dependency
- Fast
- Auto-mapping

## Caveats

This module supports only `/user/:foo` as performance reason

## Usage

### ESM

```js
import parse from 'fast-path-parse';

parse('/user/:foo')('/user/john');
```

### CJS

```js
const parse = require('fast-path-parse');

parse('/user/:foo')('/user/john');
```

## License

MIT

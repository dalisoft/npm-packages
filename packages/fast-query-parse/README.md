# fast-query-parse

Fastest `query parse` with performance of `querystring` module and features of `qs` module

## Features

- Fast
- Auto-decode URL

## Caveats

`import('qs')` is able to deep parse up-to 5-level depth of array and objects whereas `fast-query-parse` cannot do this as can parse only 1-level depth and results goes wrong if depth more than one

## Usage

```js
import parse from 'fast-query-parse';

parse('foo=bar');
```

## License

MIT

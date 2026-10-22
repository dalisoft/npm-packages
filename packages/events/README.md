# events

One more event emitter for Node.js and browser

## Features

- Performant
- Easy
- ESM only

## Installation

We recommend install via `npm` because of it's cache and flat node modules tree

```bash
npm i @dalisoft/events
```

then you able to import to Node.js/Browser easily

```js
import Events from '@dalisoft/events';
```

## Usage

```js
const ev = new Events();

ev.on('hello', (name) => console.log('Hello ', name));
ev.emit('hello', 'world');
```

## License

MIT

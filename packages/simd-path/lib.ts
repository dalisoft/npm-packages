const METHODS = {
  DELETE: 0x6,
  GET: 0x1,
  HEAD: 0x5,
  PATCH: 0x4,
  POST: 0x2,
  PUT: 0x3
} as const;

const TYPES = {
  DYNAMIC: 0x12,
  FIXED: 0x13,
  STATIC: 0x11,
  WILDCARD: 0x14
};

class BufferRoute {
  static encoder = new TextEncoder();

  static decoder = new TextDecoder();

  private buffer: SharedArrayBuffer;

  private uint: Uint8Array;

  private size = 16;

  private index = 0;

  private callbacks: Map<number, () => void> = new Map();

  constructor(capacity = 256) {
    this.buffer = new SharedArrayBuffer(capacity * this.size);
    this.uint = new Uint8Array(this.buffer);
  }

  addNode(method: keyof typeof METHODS, path: string, callback: () => void) {
    const bytes = new Uint8Array(this.size);
    const pathBytes = Buffer.from(path);

    bytes[0] = METHODS[method];
    this.callbacks.set(this.index, callback);

    bytes.set(pathBytes, 1);
    bytes.fill(0, pathBytes.length + 1, this.size - 1);
    bytes.fill(this.index++, this.size - 1, this.size);

    this.uint.set(bytes, (this.index - 1) * this.size);
  }

  matchNode(method: keyof typeof METHODS, path: string) {
    const pathBytes = Buffer.from(path);

    for (let i = 0, len = this.uint.length; i < len; i += this.size) {
      if (
        !(
          this.uint[i + 0] === METHODS[method] &&
          this.uint[i + 1] === pathBytes[0]
        )
      ) {
        continue;
      }

      if (
        this.uint[i + 2] === pathBytes[1] &&
        this.uint[i + 3] === pathBytes[2] &&
        this.uint[i + 4] === pathBytes[3] &&
        this.uint[i + 5] === pathBytes[4] &&
        this.uint[i + 6] === pathBytes[5]
      ) {
        const index = this.uint[i + this.size - 1];

        this.callbacks.get(index)?.();
      }
    }
  }
}

const r = new BufferRoute();

r.addNode('GET', '/foo/:id', () => {
  // console.log('ran');
});

console.time('match');
for (let i = 0; i < 1_000_000; i++) {
  r.matchNode('GET', '/foo/:id');
}
console.timeEnd('match');

export default class Pool<T> {
  protected pools: T[];

  protected poolSize: number;

  protected factory: () => T;

  constructor(poolSize = 10) {
    this.pools = [];

    this.poolSize = poolSize;
    this.factory = null as unknown as () => T;

    return this;
  }

  poolFactory(initFactory: () => T): this {
    this.factory = initFactory;

    return this;
  }

  free(pool: T): this {
    this.pools.push(pool);

    return this;
  }

  get(): T | null {
    if (this.pools.length > 0) {
      return this.pools.shift() || null;
    }
    return null;
  }

  create(): T {
    if (this.pools.length > 0) {
      return this.pools.shift() as T;
    }

    return this.factory();
  }

  setPoolSize(size: number): this {
    this.poolSize = size;

    return this;
  }

  initialize(): this {
    for (let i = 0; i < this.poolSize; i += 1) {
      if (this.pools.length >= this.poolSize) {
        break;
      }

      this.pools.push(this.factory());
    }

    return this;
  }
}

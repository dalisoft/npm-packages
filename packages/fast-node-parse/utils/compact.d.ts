import type { Node } from '../src/node';

declare class Compactify implements Node {
  optimize(copyProps: string[]): this;
}

// eslint-disable-next-line import-x/prefer-default-export
export { Compactify };

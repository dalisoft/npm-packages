import type { Node } from '../src/node';

declare class Compactify extends Node {
  optimize(copyProps: string[]): this;
}

export { Compactify };

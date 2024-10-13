import type Node from '../node/node';

declare class Compactify extends Node {
  optimize(copyProps: string[]): this;
}

export = Compactify;

/**
 * It is maybe looks like **binary tree**
 * but it is different algorithm was made
 * to solve the walking on routers linearly
 * so it should fast on any size of route
 */
declare class Node {
  private next: Node | undefined;

  private rootNode: boolean;

  position: number;

  segment: string;

  static: boolean;

  length: number;

  key: string | undefined;

  value: string | undefined;

  constructor(segment: string);

  push(node: Node): this;

  match(path: string): boolean;

  parse(path: string): Record<string, string>;
  parse(path: string): false;

  lookup(path: string): Node;
  lookup(path: string): false;
}

export { Node };

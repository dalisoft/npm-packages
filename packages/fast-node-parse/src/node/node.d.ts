/**
 * It is maybe looks like **binary tree**
 * but it is different algorithm was made
 * to solve the walking on routers linearly
 * so it should fast on any size of route
 * *
 * @class Node
 */
declare class Node {
  private next: Node | undefined;

  private last: boolean;

  private fixed_length: boolean;

  position: number;

  segment: string;

  static: boolean;

  length: number;

  key: string | undefined;

  value: string | undefined;

  /**
   * @param segment Segment parameter, it can be *, static or :dynamic
   * @param length This can improve performance drastically if you're using fixed-length parameter
   * @example
   * ```js
   * const root = new Node('/');
   * const foo = new Node('foo');
   * const id = new Node(':id', 5);
   *
   * root.push(foo);
   * foo.push(id);
   * ```
   */

  constructor(segment: string, length?: number);

  push(node: Node): this;

  match(path: string): boolean;

  parse(path: string): Record<string, string>;
  parse(path: string): false;

  lookup(path: string): Node;
  lookup(path: string): false;
}

export = Node;

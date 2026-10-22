import assert from 'node:assert/strict';

/**
 * Linear Router - Extended from original O(segments) design
 *
 * Original insight: position-based indexOf matching, single while loop
 * Extension: sibling chains for multi-path, priority ordering, backtracking
 *
 * Complexity: O(segments × siblings) with lazy backtracking
 * Priority: static > param > wildcard (first match wins, backtrack if fails)
 */

export class Node {
  next: Node | undefined; // next segment depth (child)
  sibling: Node | undefined; // alternative at same level
  position = 0; // hint for matching

  segment: string;
  static: boolean;
  length: number;
  key: string | undefined;
  ref: unknown;

  constructor(segment: string) {
    this.next = undefined;
    this.sibling = undefined;
    this.position = 0;

    this.segment = segment;
    this.static = !/[<>{}:*]/.test(segment);
    this.length = this.static ? segment.length : 2;

    this.key = this.static
      ? undefined
      : segment === '*'
        ? '*'
        : segment.charAt(0) === ':'
          ? segment.substring(1)
          : segment;
    this.ref = undefined;
  }

  /** Priority: static(0) > param(1) > wildcard(2) */
  get priority(): number {
    return this.static ? 0 : this.key === '*' ? 2 : 1;
  }

  /** Add sibling maintaining priority order */
  addSibling(node: Node): Node {
    node.position = this.position;

    // Higher priority than head - becomes new head
    if (node.priority < this.priority) {
      node.sibling = this;
      node.next = this.next;
      return node;
    }

    // Find insertion point
    let cursor: Node = this;
    while (cursor.sibling && cursor.sibling.priority <= node.priority) {
      if (cursor.segment === node.segment && cursor.key === node.key) {
        return cursor; // exists
      }
      cursor = cursor.sibling;
    }

    if (cursor.segment === node.segment && cursor.key === node.key) {
      return cursor; // exists
    }

    node.sibling = cursor.sibling;
    cursor.sibling = node;
    return this;
  }
}

export class NodeTree extends Node {
  constructor() {
    super('/');
  }

  insert(path: string, ref: unknown): this {
    const segments = path.split('/').slice(1);
    let current: Node = this;
    let pos = 1;

    for (const seg of segments) {
      const newNode = new Node(seg);
      newNode.position = pos;

      if (!current.next) {
        current.next = newNode;
        current = newNode;
      } else {
        // Find or create among siblings
        let found: Node | undefined;
        let cursor: Node | undefined = current.next;

        while (cursor) {
          if (
            cursor.segment === newNode.segment &&
            cursor.key === newNode.key
          ) {
            found = cursor;
            break;
          }
          cursor = cursor.sibling;
        }

        if (found) {
          current = found;
        } else {
          const newHead = current.next.addSibling(newNode);
          current.next = newHead;
          current = newNode;
        }
      }

      pos += seg.length + 1; // +1 for /
    }

    current.ref = ref;
    return this;
  }

  /**
   * Core matching with lazy backtracking
   * Single while loop - the key to simplicity
   */
  private _match(
    path: string,
    collectParams: boolean
  ): [boolean, Node | undefined, Record<string, string> | undefined] {
    let params: Record<string, string> | undefined;
    const stack: Array<[Node, number, Record<string, string> | undefined]> = [];

    let node: Node | undefined = this.next;
    let pos = 1;
    let lastMatched: Node | undefined;

    while (node || stack.length > 0) {
      // Check completion first
      if (pos > path.length) {
        if (lastMatched?.ref !== undefined) {
          return [true, lastMatched, params];
        }
        if (stack.length === 0) break;
        [node, pos, params] = stack.pop()!;
        params = params ? { ...params } : undefined;
        continue;
      }

      // Backtrack if no node
      if (!node) {
        if (stack.length === 0) break;
        [node, pos, params] = stack.pop()!;
        params = params ? { ...params } : undefined;
        continue;
      }

      // Find match among siblings
      let matched: Node | undefined;
      let matchEnd = 0;
      let cursor: Node | undefined = node;
      const alternatives: Node[] = [];

      while (cursor) {
        let end = 0;
        let matches = false;

        if (cursor.static) {
          end = pos + cursor.segment.length;
          matches =
            path.slice(pos, end) === cursor.segment &&
            (end === path.length || path[end] === '/');
        } else if (cursor.key === '*') {
          matches = pos <= path.length;
          end = path.length;
        } else {
          const slash = path.indexOf('/', pos);
          end = slash === -1 ? path.length : slash;
          matches = end > pos;
        }

        if (matches) {
          if (!matched) {
            matched = cursor;
            matchEnd = end;
          } else {
            alternatives.push(cursor);
          }
        }

        cursor = cursor.sibling;
      }

      if (!matched) {
        if (stack.length === 0) break;
        [node, pos, params] = stack.pop()!;
        continue;
      }

      // Save alternatives for backtracking
      for (const alt of alternatives) {
        stack.push([alt, pos, params]);
      }

      // Collect param
      if (collectParams && !matched.static && matched.key) {
        params ??= {};
        params[matched.key] = path.substring(pos, matchEnd);
      }

      lastMatched = matched;
      pos = matchEnd + 1;
      node = matched.next;
    }

    const success = pos > path.length && lastMatched?.ref !== undefined;
    return [success, lastMatched, params];
  }

  match(path: string): boolean {
    return this._match(path, false)[0];
  }

  parse(path: string): Record<string, string> | false {
    const [success, , params] = this._match(path, true);
    return success && params ? params : false;
  }

  lookup(path: string): unknown {
    const [success, node, params] = this._match(path, true);
    if (!success) return false;
    return typeof node?.ref === 'function' ? node.ref(params) : node?.ref;
  }
}

export class MixedTree {
  nodetree: NodeTree;
  hashtree: Record<string, unknown> = {};
  constructor() {
    this.nodetree = new NodeTree();
    this.hashtree = {};
  }
  insert<TCallback>(segment: string, ref: TCallback) {
    if (!/[<>{}:*]/.test(segment)) {
      this.hashtree[segment] = ref;
    } else {
      this.nodetree.insert(segment, ref);
    }
  }
  match(path: string) {
    return this.hashtree[path] || this.nodetree.match(path);
  }
  lookup(path: string) {
    return this.hashtree[path]
      ? // @ts-ignore
        this.hashtree[path]?.()
      : this.nodetree.lookup(path);
  }
  parse(path: string) {
    return this.hashtree[path] ? false : this.nodetree.parse(path);
  }
}

const tree = new NodeTree();

class NodeObj extends Node {
  constructor(props) {
    super(props.segment);

    Object.assign(this, props);
  }
}
/*
tree.insert('/foo/bar/baz');
tree.insert('/foo/:id');
tree.insert('/foo/:id/settings'); */

// length = length of segment IF static, otherwise 2
// position = all previous (parent) nodes length summ
/* assert.deepStrictEqual(
  tree,
  new Node2Obj({
    segment: '/',
    position: 0,
    static: true,
    length: 1,
    key: undefined,
    value: undefined,
    next: undefined,
    child: new Node2Obj({
      segment: 'foo',
      position: 1,
      static: true,
      length: 3,
      key: undefined,
      value: undefined,
      next: undefined,
      child: new Node2Obj({
        segment: 'id',
        position: 4,
        static: false,
        length: 2,
        key: 'id',
        value: undefined,
        next: new Node2Obj({
          segment: 'bar',
          position: 4,
          static: true,
          length: 3,
          key: undefined,
          value: undefined,
          next: undefined,
          child: new Node2Obj({
            segment: 'baz',
            position: 7,
            static: true,
            length: 3,
            key: undefined,
            value: undefined,
            next: undefined,
            child: undefined
          })
        }),
        child: new Node2Obj({
          segment: 'settings',
          position: 6,
          static: true,
          length: 8,
          key: undefined,
          value: undefined,
          child: undefined,
          next: undefined
        })
      })
    })
  })
); */

// console.dir(tree, { depth: null });

const modes = [
  {
    complexity: 'zero',
    path: '/foo',
    validate: '/foo'
  },
  {
    complexity: 'zero',
    path: '/foo/bar',
    validate: '/foo/bar'
  },
  {
    complexity: 'easy',
    path: '/foo/:id',
    validate: '/foo/123'
  },
  {
    complexity: 'easy',
    path: '/foo/*',
    validate: '/foo/wildcard'
  },
  {
    complexity: 'medium',
    path: '/user/:id/edit/:page',
    validate: '/user/1234/edit/weather'
  }
];
/*
const mtree = new MixedTree();

for (const { path, validate, complexity } of modes) {
  mtree.insert(path, () => {
    console.log('lookup of', { path, validate, complexity });
  });
}

// console.dir(mtree, { depth: null });

console.log('');

for (const { path, validate } of modes) {
  const matched = mtree.match(validate);
  console.log('match of', { path, validate, matched });
}

console.log('');

for (const { path, validate, complexity } of modes) {
  const parsed = mtree.parse(validate);
  console.log('parse of', { path, validate, parsed });
}

console.log('');

for (const { path, validate, complexity } of modes) {
  mtree.lookup(validate);
}*/

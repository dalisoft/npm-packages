import assert from 'node:assert/strict';

class Node {
  static SEGMENTATION_REGEXP = /[<>{}:*]/;
  child: Node | undefined;
  next: Node | undefined;
  position: number;
  static: boolean;
  segment: string;
  length: number;
  key: string | undefined;
  value: undefined;
  ref: unknown;
  constructor(segment: string) {
    this.child = undefined;
    this.next = undefined;
    this.position = 0;

    this.static = !Node.SEGMENTATION_REGEXP.test(segment);
    this.segment =
      segment === '*' ? '*' : segment.replace(Node.SEGMENTATION_REGEXP, '');
    this.length = this.static ? segment.length : 2;

    // This need for routers, otherwise you can modify it
    // or remove it, add something, do whatever you want
    this.key = this.static
      ? undefined
      : segment === '*'
        ? '*'
        : segment.charAt(0) === ':'
          ? segment.substring(1)
          : segment;
    this.value = undefined;
    this.ref = undefined;
  }
  self_compare(node: Node) {
    return this.segment === node.segment && this.key === node.key;
  }
}

export class NodeTree extends Node {
  constructor() {
    super('/');
  }

  insert<TCallback>(segment: string, ref: TCallback) {
    const nodes: Node[] = segment
      .split('/')
      .slice(1)
      .map((seg) => new Node(seg));

    let current: Node = this;

    // console.log([current, nodes]);

    for (const node of nodes) {
      let cursor = current.child;

      if (!cursor) {
        node.position = current.position + current.length;

        current.child = node;
        current = node;
        continue;
      }

      for (;;) {
        if (cursor.self_compare(node)) {
          current = cursor;
          break;
        }
        if (!cursor.next) {
          node.position = current.position + current.length;

          cursor.next = node;
          current = node;
          break;
        }
        cursor = cursor.next;
      }
    }

    current.ref = ref;

    return this;
  }

  match(path: string) {
    let node = this.child;
    let pos = 1;

    while (node) {
      for (let i = 0; i < 2; i++) {
        if (!node) {
          return false;
        }

        if (node.static) {
          if (
            path.substring(node.position, node.position + node.length) !==
            node.segment
          ) {
            console.log('aaa', {
              node,
              path,
              pos: [pos, pos + node.length],
              ref: path.substring(node.position, node.position + node.length)
            });
          }

          pos = node.position;
        } else if (node.key === '*') {
          // console.log('match wildcard', node);
        } else {
          // console.log('match dynamic', node);
        }

        node = i === 0 ? node.child : node.next;
      }
    }

    return true;
  }

  parse(path: string) {
    let node = this.child;
    let pos = 1;
    let params: Record<string, unknown> | undefined;
    let lastMatched = null;

    while (node) {
      let cursor: Node | undefined = node;
      let matched = false;

      while (cursor) {
        let nextPos: number | undefined;

        if (cursor.static) {
          const i = path.indexOf(cursor.segment, pos);
          if (i === pos) {
            nextPos = pos + cursor.segment.length;
          }
        } else {
          const i = path.indexOf('/', pos);
          nextPos = i === -1 ? path.length : i;
        }

        if (nextPos !== undefined) {
          if (!cursor.static && cursor.key) {
            if (!params) params = {};
            params[cursor.key] = path.slice(pos, nextPos);
          }

          pos = nextPos;
          lastMatched = cursor;
          node = cursor.child;
          matched = true;
          break;
        }

        cursor = cursor.next;
      }

      if (!matched) return false;
    }

    return pos === path.length ? params : false;
  }

  lookup(path: string) {
    let node = this.child;
    let pos = 1; // skip leading '/'

    let lastMatched = null;

    while (node) {
      let cursor: Node | undefined = node;
      let matched = false;

      while (cursor) {
        let nextPos: number | undefined;

        if (cursor.static) {
          const i = path.indexOf(cursor.segment, pos + 1);
          if (i === pos) {
            nextPos = pos + cursor.segment.length;
          }
        } else {
          const i = path.indexOf('/', pos + 1);
          nextPos = i === -1 ? path.length : i;
        }

        if (nextPos !== undefined) {
          pos = nextPos;
          lastMatched = cursor;
          node = cursor.child;
          matched = true;
          break;
        }

        cursor = cursor.next;
      }

      if (!matched) return false;
    }

    return pos === path.length ? lastMatched.ref?.() : false;
  }
}

export class MixedTree {
  nodetree: NodeTree;
  hashtree: Record<string, unknown> = {};
  constructor() {
    this.nodetree = new NodeTree();
    this.hashtree = {};
  }
  insert(segment, ref) {
    if (!/[<>{}:*]/.test(segment)) {
      this.hashtree[segment] = ref;
    } else {
      this.nodetree.insert(segment, ref);
    }
  }
  match(path) {
    return this.hashtree[path] || this.nodetree.match(path);
  }
  lookup(path) {
    return this.hashtree[path]
      ? this.hashtree[path]()
      : this.nodetree.lookup(path);
  }
  parse(path) {
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
  } /*
  {
    path: '/foo/:id',
    complexity: 'easy',
    validate: '/foo/123'
  },
  {
    path: '/foo/*',
    complexity: 'easy',
    validate: '/foo/wildcard'
  },
  {
    path: '/user/:id/edit/:page',
    complexity: 'medium',
    validate: '/user/1234/edit/weather'
  } */
];

const mtree = new NodeTree();

for (const { path, validate, complexity } of modes) {
  mtree.insert(path, () => {
    console.log('lookup of', { complexity, path, validate });
  });
}

// console.dir(mtree, { depth: null });

console.log('');

for (const { path, validate } of modes) {
  const matched = mtree.match(validate);
  console.log('match of', { matched, path, validate });
}

console.log('');

for (const { path, validate, complexity } of modes) {
  const parsed = mtree.parse(validate);
  // console.log('parse of', { path, validate, parsed });
}

console.log('');

for (const { path, validate, complexity } of modes) {
  // mtree.lookup(validate);
}

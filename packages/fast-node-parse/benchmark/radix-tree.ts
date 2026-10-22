const radix = () => {
  const tree: Record<string, unknown> = {};

  const insert = <T>(path: string, descriptor: T) => {
    const root = path === '/';
    let _tree = tree;

    for (const char of path) {
      if (!_tree[char]) {
        _tree[char] = {};
      }
      _tree = _tree[char] as typeof tree;
    }

    _tree.descriptor = descriptor;

    return { root, tree };
  };

  const merge = () => {
    const prefixChildren = (node: typeof tree) => {
      const keys = Object.keys(node);

      for (const key of keys) {
        if (key === 'descriptor' || key.startsWith('/')) {
          continue;
        }

        node[`/${key}`] = node[key];
        delete node[key];
      }
    };

    const compress = (_tree: typeof tree) => {
      for (const key of Object.keys(_tree)) {
        if (key === 'descriptor') {
          continue;
        }

        const child = _tree[key] as typeof tree;

        if (typeof child === 'object' && child) {
          compress(child);
        }
      }

      let merged = true;

      while (merged) {
        merged = false;

        for (const key of Object.keys(_tree)) {
          if (key === 'descriptor') {
            continue;
          }

          const child = _tree[key] as typeof tree;

          if (typeof child !== 'object' || !child) {
            continue;
          }

          const childKeys = Object.keys(child).filter(
            (name) => name !== 'descriptor'
          );

          if (childKeys.length === 1 && !Object.hasOwn(child, 'descriptor')) {
            const [onlyKey] = childKeys;
            const next = child[onlyKey] as typeof tree;

            if (!next || typeof next !== 'object') {
              continue;
            }

            if (onlyKey === '/') {
              prefixChildren(next);
              _tree[key + onlyKey] = next;
              delete _tree[key];
              merged = true;
              break;
            }

            const slashIndex = onlyKey.indexOf('/', 1);

            if (slashIndex > 0) {
              const prefix = onlyKey.slice(0, slashIndex);
              const suffix = onlyKey.slice(slashIndex);
              const newNode: typeof tree = {};

              newNode[suffix] = next;
              _tree[key + prefix] = newNode;
              delete _tree[key];

              compress(newNode);
              merged = true;
              break;
            }

            if (!onlyKey.includes('/')) {
              _tree[key + onlyKey] = next;
              delete _tree[key];
              merged = true;
              break;
            }
          }
        }
      }
    };

    // Collapse single-child chains while preserving segment boundaries for radix behaviour.
    compress(tree);
  };

  return { insert, merge, tree };
};

const tree = radix();
tree.insert('/foo/:bar/id/user', {
  handler: () => ({ settings: {} }) as const
});
tree.insert('/foo/bar', {
  handler: () => ({ foo_bar: 1 }) as const
});
tree.insert('/foo/baz', {
  handler: () => ({ foo_bar: 1 }) as const
});

// console.dir(tree.tree, { depth: null });

tree.merge();

console.dir(tree.tree, { depth: null });
/**
 * Excepted
 *
 * /foo/ ->
 *          /:bar
 *          /ba ->
 *             r -> descriptor
 *             z -> descriptor
 */

type ParamsRecord = Record<string, string>;

type DescriptorContext = { params: ParamsRecord };

type DescriptorFn = (context: DescriptorContext) => unknown;

interface RouteLeaf<T = unknown> {
  payload: T;
  descriptor?: DescriptorFn;
}

interface RouteNode {
  staticChildren: Map<string, RouteNode>;
  paramChild?: RouteNode;
  wildcardChild?: RouteNode;
  paramName?: string;
  greedy?: boolean;
  leaf?: RouteLeaf;
}

interface MethodRoutes {
  static: Map<string, RouteLeaf>;
  dynamic: RouteNode;
}

const SegmentKind = {
  Param: 'param',
  Static: 'static',
  Wildcard: 'wildcard'
} as const;

type SegmentKindValue = (typeof SegmentKind)[keyof typeof SegmentKind];

const createNode = (): RouteNode => ({
  staticChildren: new Map<string, RouteNode>()
});

const createLeaf = <T>(payload: T): RouteLeaf<T> => {
  const maybeDescriptor =
    payload &&
    typeof (payload as unknown as { descriptor?: unknown }).descriptor ===
      'function'
      ? (payload as unknown as { descriptor: DescriptorFn }).descriptor
      : undefined;

  return {
    descriptor: maybeDescriptor,
    payload
  };
};

export class FastTree {
  private readonly methods = new Map<string, MethodRoutes>();

  insert<T>(method: string, path: string, params: T) {
    const normalizedMethod = this.normalizeMethod(method);
    const normalizedPath = this.normalizePath(path);
    const methodRoutes = this.ensureMethod(normalizedMethod);

    if (this.isStaticPath(normalizedPath)) {
      methodRoutes.static.set(normalizedPath, createLeaf(params));

      return this;
    }

    const segments = this.splitSegments(normalizedPath);
    let node = methodRoutes.dynamic;

    if (!segments.length) {
      node.leaf = createLeaf(params);

      return this;
    }

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const kind = this.segmentKind(segment);
      const isLast = i === segments.length - 1;

      if (kind === SegmentKind.Static) {
        let child = node.staticChildren.get(segment);

        if (!child) {
          child = createNode();
          node.staticChildren.set(segment, child);
        }

        node = child;
        continue;
      }

      if (kind === SegmentKind.Param) {
        let child = node.paramChild;

        if (!child) {
          child = createNode();
          child.paramName = this.extractParamName(segment);
          node.paramChild = child;
        }

        node = child;
        continue;
      }

      // Wildcard
      let child = node.wildcardChild;

      if (!child) {
        child = createNode();
        child.paramName = '*';
        node.wildcardChild = child;
      }

      if (isLast) {
        child.greedy = true;
      }

      node = child;
    }

    node.leaf = createLeaf(params);

    return this;
  }

  /**
   * Matches if path already registered
   * Does not parse params and does not execute function
   * @example
   * ```js
   * fastTree.match('POST', '/users') // create a new user route exists?
   * ```
   */
  match(method: string, path: string) {
    const normalizedMethod = this.normalizeMethod(method);
    const normalizedPath = this.normalizePath(path);
    const methodRoutes = this.methods.get(normalizedMethod);

    if (!methodRoutes) {
      return false;
    }

    if (methodRoutes.static.has(normalizedPath)) {
      return true;
    }

    const segments = this.splitSegments(normalizedPath);

    if (!segments.length) {
      return Boolean(methodRoutes.dynamic.leaf);
    }

    return Boolean(this.findNode(methodRoutes.dynamic, segments, 0));
  }

  /**
   * Parses parameters for a method/path combination without executing descriptor
   */
  parse(method: string, path: string) {
    const normalizedMethod = this.normalizeMethod(method);
    const normalizedPath = this.normalizePath(path);
    const methodRoutes = this.methods.get(normalizedMethod);

    if (!methodRoutes) {
      return false;
    }

    if (methodRoutes.static.has(normalizedPath)) {
      return {} as ParamsRecord;
    }

    const segments = this.splitSegments(normalizedPath);
    const params: ParamsRecord = {};
    const found = this.findNode(methodRoutes.dynamic, segments, 0, params);

    if (!found) {
      return false;
    }

    return params;
  }

  /**
   * Matches if path already registered
   * Does not parse params and does not execute function
   * @example
   * ```js
   * fastTree.lookup('GET', '/foo/123/user') // matches the route (this case that's `/foo/:id`), parses the params (`{id: 123}`) and executes the `descriptor`
   * ```
   */
  lookup(method: string, path: string) {
    const normalizedMethod = this.normalizeMethod(method);
    const normalizedPath = this.normalizePath(path);
    const methodRoutes = this.methods.get(normalizedMethod);

    if (!methodRoutes) {
      return false;
    }

    if (methodRoutes.static.has(normalizedPath)) {
      const staticLeaf = methodRoutes.static.get(normalizedPath)!;

      return this.execute(staticLeaf, {});
    }

    const segments = this.splitSegments(normalizedPath);
    const params: ParamsRecord = {};
    const found = this.findNode(methodRoutes.dynamic, segments, 0, params);

    if (!found) {
      return false;
    }

    return this.execute(found, params);
  }

  private normalizeMethod(method: string) {
    return method ? method.toUpperCase() : '';
  }

  private normalizePath(path: string) {
    if (!path) {
      return '/';
    }

    let normalized = path.charCodeAt(0) === 47 ? path : `/${path}`;

    if (normalized.length > 1 && normalized.endsWith('/')) {
      let end = normalized.length;

      while (end > 1 && normalized.charCodeAt(end - 1) === 47) {
        end--;
      }

      normalized = normalized.slice(0, end);
    }

    return normalized;
  }

  private ensureMethod(method: string) {
    let methodRoutes = this.methods.get(method);

    if (!methodRoutes) {
      methodRoutes = {
        dynamic: createNode(),
        static: new Map<string, RouteLeaf>()
      } as MethodRoutes;

      this.methods.set(method, methodRoutes);
    }

    return methodRoutes;
  }

  private splitSegments(path: string) {
    if (path === '/') {
      return [] as string[];
    }

    return path.slice(1).split('/').filter(Boolean);
  }

  private isStaticPath(path: string) {
    const segments = this.splitSegments(path);

    for (let i = 0; i < segments.length; i++) {
      if (this.segmentKind(segments[i]) !== SegmentKind.Static) {
        return false;
      }
    }

    return true;
  }

  private segmentKind(segment: string): SegmentKindValue {
    if (segment === '*') {
      return SegmentKind.Wildcard;
    }

    const firstChar = segment.charCodeAt(0);

    if (firstChar === 58 /* : */) {
      return SegmentKind.Param;
    }

    const lastChar = segment.charCodeAt(segment.length - 1);

    if (
      (firstChar === 123 && lastChar === 125) ||
      (firstChar === 60 && lastChar === 62)
    ) {
      return SegmentKind.Param;
    }

    return SegmentKind.Static;
  }

  private extractParamName(segment: string) {
    if (!segment) {
      return '';
    }

    const firstChar = segment.charCodeAt(0);
    const lastChar = segment.charCodeAt(segment.length - 1);

    if (firstChar === 58 /* : */) {
      return segment.slice(1);
    }

    if (
      (firstChar === 123 && lastChar === 125) ||
      (firstChar === 60 && lastChar === 62)
    ) {
      return segment.slice(1, -1);
    }

    return segment;
  }

  private findNode(
    node: RouteNode,
    segments: string[],
    index: number,
    params?: ParamsRecord
  ): RouteLeaf | undefined {
    if (index === segments.length) {
      return node.leaf;
    }

    const segment = segments[index];
    const staticChild = node.staticChildren.get(segment);

    if (staticChild) {
      const found = this.findNode(staticChild, segments, index + 1, params);

      if (found) {
        return found;
      }
    }

    const paramChild = node.paramChild;

    if (paramChild) {
      const paramName = paramChild.paramName;

      if (paramName && params) {
        params[paramName] = segment;
      }

      const found = this.findNode(paramChild, segments, index + 1, params);

      if (found) {
        return found;
      }

      if (paramName && params) {
        delete params[paramName];
      }
    }

    const wildcardChild = node.wildcardChild;

    if (wildcardChild) {
      const paramName = wildcardChild.paramName;

      if (wildcardChild.greedy) {
        if (wildcardChild.leaf) {
          if (paramName && params) {
            params[paramName] = segments.slice(index).join('/');
          }

          return wildcardChild.leaf;
        }
      } else {
        if (paramName && params) {
          params[paramName] = segment;
        }

        const found = this.findNode(wildcardChild, segments, index + 1, params);

        if (found) {
          return found;
        }

        if (paramName && params) {
          delete params[paramName];
        }
      }
    }

    return undefined;
  }

  private execute(leaf: RouteLeaf, params: ParamsRecord) {
    if (leaf.descriptor) {
      return leaf.descriptor({ params });
    }

    return leaf.payload;
  }
}

const fastTree = new FastTree();

fastTree.insert('GET', '/foo/bar', {
  descriptor: () => ({ path: '/foo/bar' })
});
fastTree.insert('GET', '/foo/:id', {
  descriptor: ({ params: { id } }: { params: { id: string } }) => ({
    path: `/foo/${id}`
  })
});
fastTree.insert('GET', '/foo/:id/user', {
  descriptor: ({ params: { id } }: { params: { id: string } }) => ({
    path: `/foo/${id}/user`
  })
});

/**
 * RULES
 * * Allowed
 * *  - Separate or match static, dynamic/param, wildcard routes
 * * - Using while, for, Map, Set, WeakMap, WeakSet and other tools
 * * - Doing benchmark
 * * - Doing testing
 * * Rules
 * * - static routes match and lookup should be O(1) for performance reason and avoid parse unnecessary params
 * * - dynamic/param routes match and lookup should be O(k) where `k = number of segments`
 * * - Always do a benchmark
 * * - Always do a testing
 * * Disallowed
 * * - Using evals
 * * - Using `new Function`
 * * - Using hardcodes
 * * - Using workarounds
 * * - Skipping benchmark
 * * - Skipping testing
 */

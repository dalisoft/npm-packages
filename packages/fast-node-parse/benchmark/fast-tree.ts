class FastTree {
  insert<T>(method: string, path: string, params: T) {
    // implement logic
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
    return true;
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
    // implement
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

/**
 * Compiles an route path for fastest parsing
 * @param path A path to be compiled
 * @returns Optimized function which parse params at runtime
 * @example
 * ```ts
 * import compile from 'fast-path-parser/aot/parse';
 *
 * const pathParse = compile('/user/:id');
 * pathParse('/user/123') // returns { id: '123' }
 * ```
 */
function parse(
  path: string
): (
  pathname: string,
  params?: Record<string, string>
) => Record<string, string>;

export = parse;

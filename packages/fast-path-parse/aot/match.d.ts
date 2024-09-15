/**
 * Compiles an route path for fastest validation
 * @param path A path to be compiled
 * @returns Optimized function which validate params at runtime
 * @example
 * ```ts
 * import compile from 'fast-path-parser/aot/match';
 *
 * const pathMatch = compile('/user/:id');
 * pathMatch('/user/123') // returns `true`
 * ```
 */
function match(path: string): (pathname: string) => boolean;

export = match;

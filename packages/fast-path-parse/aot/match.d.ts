/**
 * Compiles an route path for fastest validation
 * @param path A path to be compiled
 * @param compact An status of compiler to reduce segments
 * @returns Optimized function which validate params at runtime
 * @example
 * ```ts
 * import compile from 'fast-path-parser/aot/match';
 *
 * const pathMatch = compile('/user/:id');
 * pathMatch('/user/123') // returns `true`
 * ```
 */
function match(path: string, compact: boolean): (pathname: string) => boolean;

export = match;

/**
 * Prepares an route path for validating
 * @param path A path to be compiled
 * @param compact An status of compiler to reduce segments
 * @returns Function which validates runtime
 * @example
 * ```ts
 * import match from 'fast-path-parser/runtime/match';
 *
 * const pathMatch = match('/user/:id');
 * pathMatch('/user/123') // returns `true`
 * ```
 */
function match(path: string, compact: boolean): (pathname: string) => boolean;

export = match;

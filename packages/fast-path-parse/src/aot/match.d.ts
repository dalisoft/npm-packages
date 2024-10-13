import type { IOptions } from '../runtime/match';

/**
 * Compiles an route path for fastest validation
 * @param path A path to be compiled
 * @param options Options to configure the match
 * @param options.ignoreTrailingSlash Compare strictly or loosely
 * @param options.compact An status of compiler to reduce segments
 * @returns Optimized function which validate params at runtime
 * @example
 * ```ts
 * import compile from 'fast-path-parser/aot/match';
 *
 * const pathMatch = compile('/user/:id');
 * pathMatch('/user/123') // returns `true`
 * ```
 */
function match(
  path: string,
  options: Partial<IOptions>
): (pathname: string) => boolean;

export = match;

import type { IOptions } from '../runtime/match';

/**
 * Compiles an route path for fastest parsing
 * @param path A path to be compiled
 * @param options Options to configure the parse
 * @param options.ignoreTrailingSlash Compare strictly or loosely
 * @param options.compact An status of compiler to reduce segments
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
  path: string,
  options: Partial<IOptions>
): (
  pathname: string,
  params?: Record<string, string>
) => Record<string, string>;

export = parse;

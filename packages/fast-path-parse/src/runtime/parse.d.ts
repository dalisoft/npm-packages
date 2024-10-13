import type { IOptions } from './match';

/**
 * Prepares an route path for parsing
 * @param path A path to be compiled
 * @param options Options to configure the parse
 * @param options.ignoreTrailingSlash Compare strictly or loosely
 * @param options.compact An status of compiler to reduce segments
 * @returns Function which parse params at runtime
 * @example
 * ```ts
 * import parse from 'fast-path-parser/runtime/parse';
 *
 * const pathParse = parse('/user/:id');
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

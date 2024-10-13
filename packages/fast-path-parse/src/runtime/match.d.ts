export interface IOptions {
  ignoreTrailingSlash: boolean;
  compact: boolean;
}

/**
 * Prepares an route path for validating
 * @param path A path to be compiled
 * @param options Options to configure the match
 * @param options.ignoreTrailingSlash Compare strictly or loosely
 * @param options.compact An status of compiler to reduce segments
 * @returns Function which validates runtime
 * @example
 * ```ts
 * import match from 'fast-path-parser/runtime/match';
 *
 * const pathMatch = match('/user/:id');
 * pathMatch('/user/123') // returns `true`
 * ```
 */
function match(
  path: string,
  options: Partial<IOptions>
): (pathname: string) => boolean;

export = match;

/**
 * Prepares an route path for parsing
 * @param {string} path A path to be compiled
 * @returns {(pathname: string, params?: Record<string, string>) => params} Function which parse params at runtime
 * @example
 * ```ts
 * import parse from 'fast-path-parser/runtime/parse';
 *
 * const pathParse = parse('/user/:id');
 * pathParse('/user/123') // returns { id: '123' }
 * ```
 */
const parse = (path) => {
  /**
   * @type {Array<string | null>}
   */
  const segments = path
    .split('/')
    .map((name) => (name.charAt(0) === ':' ? name.substring(1) : null));
  const segmentsFilled = segments.filter((segment) => segment);

  return segmentsFilled.length > 0
    ? (pathname, params = {}) => {
        let index = 0;

        let i;
        let lastIndex = 0;

        // biome-ignore lint/style/noParameterAssign: This makes last entry forcefully parse
        pathname += '/';

        // biome-ignore lint/suspicious/noAssignInExpressions: It saves additional CPU cycles
        while ((i = pathname.indexOf('/', lastIndex)) !== -1) {
          const key = segments[index];

          if (key) {
            const value = pathname.substring(lastIndex, i);

            params[key] = value;
          }

          lastIndex = i + 1;
          index++;
        }

        return params;
      }
    : (_, params = {}) => params;
};

module.exports = parse;

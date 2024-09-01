/**
 * Compiles an route path for fastest parsing
 * @param {string} path A path to be compiled
 * @returns {(pathname: string, params?: Record<string, string>) => params} Optimized function which parse params at runtime
 * @example
 * ```ts
 * import compile from 'fast-path-parser/aot/parse';
 *
 * const pathParse = compile('/user/:id');
 * pathParse('/user/123') // returns { id: '123' }
 * ```
 */
const compile = (path) => {
  /**
   * @type {Array<string | null>}
   */
  const segments = path
    .split('/')
    .map((name) => (name.charAt(0) === ':' ? name.substring(1) : null));
  const segmentsFilled = segments.filter((segment) => segment);

  if (segmentsFilled.length > 0) {
    let aotJit = `function compilePath(pathname, params = {}) {
        let i;
        let lastIndex = 0;

        pathname += '/';
    `;

    for (const segment of segments) {
      if (segment) {
        aotJit += `
        i = pathname.indexOf('/', lastIndex);
        if (i !== -1) {
          params['${segment}'] = pathname.substring(lastIndex, i);
          lastIndex = i + 1;
        }
        `;
      } else {
        aotJit += `
        i = pathname.indexOf('/', lastIndex);
        if (i !== -1) {
          lastIndex = i + 1;
        }
        `;
      }
    }

    aotJit += `
        return params
  }`;

    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return new Function(`return ${aotJit}`)();
  }

  return (_, params = {}) => params;
};

module.exports = compile;

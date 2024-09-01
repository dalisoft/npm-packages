const { SLASH_CODE } = require('../constants.js');
const segmentsSlice = require('../utils/segment.js');

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
  const { segments, filled } = segmentsSlice(path);

  if (filled.length > 0) {
    let aotJit = `function compilePath(pathname, params = {}) {
        let uri = pathname;

        let i;
        let lastIndex = 1;
        let value;`;

    for (const segment of segments) {
      aotJit += `
        i = uri.indexOf('/', lastIndex);
        `;

      if (segment.last) {
        aotJit +=
          'i === -1 ? value = uri.substring(lastIndex) : value = uri.substring(lastIndex, i);';
      } else {
        aotJit += `if (i < ${segment.position}) { return params; }`;
        aotJit += 'value = uri.substring(lastIndex, i);';
      }

      if (segment.segment) {
        aotJit += `
          params['${segment.name}'] = value;
          `;
      }

      aotJit += `lastIndex = i + 1;
`;
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

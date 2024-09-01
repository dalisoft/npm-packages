const { SLASH_CODE } = require('../constants.js');
const segmentsSlice = require('../utils/segment.js');

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
  const { segments, filled } = segmentsSlice(path);

  return filled.length > 0
    ? (pathname, params = {}) => {
        let uri = pathname;

        let i;
        let lastIndex = 1;

        if (uri.charCodeAt(uri.length - 1) !== SLASH_CODE) {
          uri += '/';
        }

        for (const segment of segments) {
          i = uri.indexOf('/', lastIndex);

          if (i < segment.position) {
            return params;
          }

          if (segment.segment) {
            params[segment.name] = uri.substring(lastIndex, i);
          }

          lastIndex = i + 1;
        }

        return params;
      }
    : (_, params = {}) => params;
};

module.exports = parse;

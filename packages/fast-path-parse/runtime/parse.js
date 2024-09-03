const segmentsSlice = require('../utils/segment.js');

/**
 * Prepares an route path for parsing
 * @type {import('./parse')}
 * @param path A path to be compiled
 * @returns Function which parse params at runtime
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
    ? // eslint-disable-next-line complexity
      (pathname, params = {}) => {
        let i;
        let lastIndex = 1;

        for (const segment of segments) {
          i = pathname.indexOf('/', lastIndex);

          if (!segment.last && i < segment.position) {
            return params;
          }

          if (segment.segment) {
            params[segment.name] =
              segment.last && i === -1
                ? pathname.substring(lastIndex)
                : pathname.substring(lastIndex, i);
          }

          lastIndex = i + 1;
        }

        return params;
      }
    : (_, params = {}) => params;
};

module.exports = parse;

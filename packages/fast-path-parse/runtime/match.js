const segmentsSlice = require('../utils/segment.js');

/**
 * Prepares an route path for validating
 * @param {string} path A path to be compiled
 * @returns {(pathname: string, params?: Record<string, string>) => boolean} Function which validates runtime
 * @example
 * ```ts
 * import match from 'fast-path-parser/runtime/match';
 *
 * const pathMatch = match('/user/:id');
 * pathMatch('/user/123') // returns `true`
 * ```
 */

const match = (path) => {
  const { segments, filled, length: LENGTH } = segmentsSlice(path);

  return filled.length > 0
    ? // eslint-disable-next-line complexity
      (pathname) => {
        let i;
        let lastIndex = 1;
        let isValid = true;

        for (let index = 0; isValid && index < LENGTH; index++) {
          const segment = segments[index];

          i = pathname.indexOf('/', lastIndex);

          if (!segment.last && i < segment.position) {
            return false;
          }

          const value =
            segment.last && i === -1
              ? pathname.substring(lastIndex)
              : pathname.substring(lastIndex, i);

          if (segment.segment) {
            isValid = value.length > 0;
          } else {
            isValid = value === segment.name;
          }

          lastIndex = i + 1;
        }

        return isValid;
      }
    : (url) =>
        url === path ||
        `${url}/` === path ||
        url === `${path}/` ||
        `/${url}` === path ||
        url === `/${path}`;
};

module.exports = match;

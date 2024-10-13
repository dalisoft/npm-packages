const segmentsSlice = require('../utils/segment.js');

/**
 * @type {import('./parse')}
 */
const parse = (path, { compact, ignoreTrailingSlash = true } = {}) => {
  const { segments, filled, length: LENGTH } = segmentsSlice(path, compact);

  return filled.length > 0
    ? (pathname, params = {}) => {
        let i;
        let lastIndex = 1;

        for (let index = 0; index < LENGTH; index++) {
          const segment = segments[index];

          i = pathname.indexOf('/', lastIndex);

          if (i === -1 && i < segment.position) {
            return {};
          }

          if (segment.segment) {
            params[segment.name] =
              segment.last && i === -1 && ignoreTrailingSlash
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

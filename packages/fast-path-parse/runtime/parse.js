const segmentsSlice = require('../utils/segment.js');
/**
 * @type {import('./parse')}
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

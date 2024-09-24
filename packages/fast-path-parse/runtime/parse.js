const segmentsSlice = require('../utils/segment.js');

/**
 * @type {import('./parse')}
 */
const parse = (path, compact) => {
  const { segments, filled, length: LENGTH } = segmentsSlice(path, compact);

  return filled.length > 0
    ? (pathname, params = {}) => {
        let i;
        let lastIndex = 1;

        for (let index = 0; index < LENGTH; index++) {
          const segment = segments[index];

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

console.log(parse('/foo/:bar')('/(process.exit(1))'));

module.exports = parse;

const { equal, strictEqual } = require('../utils/equal-path.js');
const segmentsSlice = require('../utils/segment.js');

/**
 * @type {import('./match')}
 */
const match = (path, { compact, ignoreTrailingSlash = true } = {}) => {
  const { segments, filled, length: LENGTH } = segmentsSlice(path, compact);

  return filled.length > 0
    ? (pathname) => {
        let i;
        let lastIndex = 1;
        let isValid = true;

        for (let index = 0; isValid && index < LENGTH; index++) {
          const segment = segments[index];

          // The static segment should be handled fast
          // This way it is more faster and efficient
          if (!segment.segment) {
            isValid =
              pathname.substring(lastIndex, lastIndex + segment.size) ===
              segment.name;

            lastIndex += segment.size + 1;

            continue;
          }

          i = pathname.indexOf('/', lastIndex);

          if (!segment.last && i < segment.position && !ignoreTrailingSlash) {
            return false;
          }

          const value =
            segment.last && i === -1
              ? pathname.substring(lastIndex)
              : pathname.substring(lastIndex, i);

          isValid = value.length > 0;

          lastIndex = i + 1;
        }


          return isValid && (ignoreTrailingSlash || i === -1);
      }
    : ignoreTrailingSlash
      ? (url) => equal(url, path)
      : (url) => strictEqual(url, path);
};

module.exports = match;

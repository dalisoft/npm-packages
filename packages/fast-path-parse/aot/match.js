const { SLASH_CODE } = require('../constants.js');
const segmentsSlice = require('../utils/segment.js');

/**
 * Compiles an route path for fastest validation
 * @param {string} path A path to be compiled
 * @returns {(pathname: string, params?: Record<string, string>) => boolean} Optimized function which validate params at runtime
 * @example
 * ```ts
 * import compile from 'fast-path-parser/aot/match';
 *
 * const pathMatch = compile('/user/:id');
 * pathMatch('/user/123') // returns `true`
 * ```
 */
const match = (path) => {
  const { segments, filled } = segmentsSlice(path);

  if (filled.length > 0) {
    let aotJit = `function matchPath(pathname) {
        let uri = pathname;

        let i;
        let lastIndex = 1;
        let isValid = true;

        let value;

        if (uri.charCodeAt(uri.length - 1) !== ${SLASH_CODE}) {
          uri += '/';
        }`;

    for (const segment of segments) {
      aotJit += `
        if (!isValid) { return false; }

        i = uri.indexOf('/', lastIndex);

        if (i < ${segment.position}) { return false; }

        value = uri.substring(lastIndex, i);
          lastIndex = i + 1;`;

      if (segment.segment) {
        aotJit += `
          isValid = value.length > 0;`;
      } else {
        aotJit += `
          isValid = value === '${segment.name}';`;
      }
    }
    aotJit += `
        return isValid;
    }`;

    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return new Function(`return ${aotJit}`)();
  }

  return (url) =>
    url === path ||
    `${url}/` === path ||
    url === `${path}/` ||
    `/${url}` === path ||
    url === `/${path}`;
};

module.exports = match;

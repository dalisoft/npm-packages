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
// eslint-disable-next-line max-lines-per-function
const match = (path) => {
  /**
   * @type {Array<{name: string; segment: boolean}>}
   */
  const segments = path
    .split('/')
    .map((name) =>
      name.charAt(0) === ':'
        ? { name: name.substring(1), segment: true }
        : { name, segment: false }
    );
  const segmentsFilled = segments.filter((segment) => segment.segment);

  if (segmentsFilled.length > 0) {
    let aotJit = `function matchPath(pathname) {
        let i;
        let lastIndex = 0;
        let isValid = true;

        let key;
        let value;

        pathname += '/';
    `;

    for (const segment of segments) {
      if (segment.segment) {
        aotJit += `
        if (!isValid) {
          return false;
        }

        i = pathname.indexOf('/', lastIndex);
        if (i !== -1) {
          key = '${segment.name}';
          value = pathname.substring(lastIndex, i);
          lastIndex = i + 1;

          isValid = isValid && value !== undefined && value.length > 0;
        }
        `;
      } else {
        aotJit += `
        if (!isValid) {
          return false;
        }

        i = pathname.indexOf('/', lastIndex);
        if (i !== -1) {
          value = pathname.substring(lastIndex, i);
          lastIndex = i + 1;

          isValid = isValid && value === '${segment.name}';
        }
        `;
      }
    }

    aotJit += `
        return isValid
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

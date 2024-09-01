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

  return segmentsFilled.length > 0
    ? // eslint-disable-next-line complexity
      (pathname) => {
        let index = 0;

        let i;
        let lastIndex = 0;
        let isValid = true;

        // biome-ignore lint/style/noParameterAssign: This makes last entry forcefully parse
        pathname += '/';

        // biome-ignore lint/suspicious/noAssignInExpressions: It saves additional CPU cycles
        while (isValid && (i = pathname.indexOf('/', lastIndex)) !== -1) {
          const segment = segments[index];
          const value = pathname.substring(lastIndex, i);

          if (segment.segment) {
            isValid = isValid && value !== undefined && value.length > 0;
          } else {
            isValid = isValid && value === segment.name;
          }

          lastIndex = i + 1;
          index++;
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

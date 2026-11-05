/**
 * Compares two string and compares
 * @param {string} url
 * @param {string} path
 * @returns {boolean}
 */
export const equal = (url, path) =>
  url === path ||
  `${url}/` === path ||
  url === `${path}/` ||
  `/${url}` === path ||
  url === `/${path}`;

/**
 * Strcitly ompares two string and compares
 * @param {string} url
 * @param {string} path
 * @returns {boolean}
 */
export const strictEqual = (url, path) => url === path;

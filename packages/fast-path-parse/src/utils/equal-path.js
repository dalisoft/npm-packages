/**
 * Compares two string and compares
 * @param {string} url
 * @param {string} path
 * @returns {boolean}
 */
module.exports.equal = (url, path) =>
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
module.exports.strictEqual = (url, path) => url === path;

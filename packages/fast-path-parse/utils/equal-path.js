/**
 * Compares two string and compares
 * @param {string} url
 * @param {string} path
 * @returns {boolean}
 */
module.exports = (url, path) =>
  url === path ||
  `${url}/` === path ||
  url === `${path}/` ||
  `/${url}` === path ||
  url === `/${path}`;

/**
 * Compares two string and compares
 * @param {string} url
 * @param {string} path
 * @returns {boolean}
 */
export default (url, path) =>
  url === path ||
  `${url}/` === path ||
  url === `${path}/` ||
  `/${url}` === path ||
  url === `/${path}`;

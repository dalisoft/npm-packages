/* eslint-disable no-cond-assign, eslint-comments/disable-enable-pair, no-param-reassign, @typescript-eslint/restrict-plus-operands */

const prepareMatches = (match) => {
  let i = 0;
  let lastIndex = -1;
  const map = [];

  let currentPath;
  let char;

  while ((i = match.indexOf('/', lastIndex)) !== -1) {
    currentPath = match.substring(lastIndex, i);
    char = currentPath.charAt(0);

    if (char === ':') {
      map.push(currentPath.substr(1));
    } else {
      map.push(null);
    }

    lastIndex = i + 1;
  }

  currentPath = match.substring(lastIndex);
  char = currentPath.charAt(0);

  if (char === ':') {
    map.push(currentPath.substr(1));
  } else {
    map.push(null);
  }

  return map;
};

/**
 * Parser path string into object
 * @param {String} str Input string
 *
 * @example
 * parse('/user/:id')('/user/1234');
 */
const fastPathParse = (match) => {
  const map = prepareMatches(match);

  // eslint-disable-next-line complexity
  return (path) => {
    let params = null;

    let i;
    let lastIndex = -1;
    let index = 0;

    let key;
    let value;

    while ((i = path.indexOf('/', lastIndex)) !== -1) {
      value = path.substring(lastIndex, i);

      key = map[index];
      if (key) {
        if (!params) {
          params = {};
        }

        params[key] = value;
      }

      lastIndex = i + 1;
      index += 1;
    }

    value = path.substring(lastIndex);

    key = map[index];
    if (key) {
      if (!params) {
        params = {};
      }

      params[key] = value;
    }

    return params;
  };
};

module.exports = fastPathParse;

const fastUrlDecode = require('fast-decode-uri-component');

/**
 * Parser string or URL encoded string to object
 * @param {String} str Input string
 * @param {Boolean} enableParser Enable deep parser for handling complex queries
 * @param {String} delimiter Delimiter during parsing
 * @example
 * parse('foo=bar')
 */
// eslint-disable-next-line complexity
function parse(str, enableParser = false, delimiter = '&') {
  let query = str;

  if (typeof str !== 'string' || str.length < 3 || str.indexOf('=') === -1) {
    return null;
  }
  if (str.indexOf('%') !== -1) {
    query = fastUrlDecode(str);
  }

  const map = {};

  let i;
  let lastIndex = 0;

  query += delimiter;

  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  while ((i = query.indexOf(delimiter, lastIndex)) !== -1) {
    const entry = query.substring(i, lastIndex);
    const SPLIT_INDEX = entry.indexOf('=');

    if (SPLIT_INDEX !== -1) {
      const key = entry.substring(0, SPLIT_INDEX);
      const value = entry.substring(SPLIT_INDEX + 1);

      const BRACKET_INDEX = enableParser && key.indexOf('[');
      if (enableParser && BRACKET_INDEX !== -1) {
        const mapkey = key.substring(0, BRACKET_INDEX);
        const subkey = key.substring(BRACKET_INDEX + 1, key.indexOf(']'));
        let submap;

        // eslint-disable-next-line max-depth
        if (!subkey || !Number.isNaN(+subkey)) {
          submap = map[mapkey] || [];
          submap[submap.length] = value;
        } else {
          submap = map[mapkey] || {};
          submap[subkey] = value;
        }

        map[mapkey] = submap;
      } else {
        map[key] = value;
      }
    }

    lastIndex = i + 1;
  }

  return map;
}

module.exports = parse;

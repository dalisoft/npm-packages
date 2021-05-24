// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-param-reassign, @typescript-eslint/restrict-plus-operands */
const fastUrlDecode = require('fast-decode-uri-component');

/**
 * Parser string or URL encoded string to object
 * @param {String} str Input string
 *
 * @example
 * parse('foo=bar')
 */
function parse(str) {
  if (str.indexOf('%') !== -1) {
    str = fastUrlDecode(str);
  }

  let index = -1;
  let lastIndex = 0;
  let returns;

  let field;
  let keyIndex;
  let key;
  let value;

  // eslint-disable-next-line no-cond-assign
  while ((index = str.indexOf('&', lastIndex)) !== -1) {
    field = str.substring(lastIndex, index);

    keyIndex = field.indexOf('=');
    key = field.substr(0, keyIndex);
    value = field.substr(keyIndex + 1);

    returns[key] = value;

    lastIndex = index + 1;
  }
  field = str.substr(lastIndex);
  keyIndex = field.indexOf('=');
  key = field.substr(0, keyIndex);
  value = field.substr(keyIndex + 1);

  returns[key] = value;

  return returns;
}

module.exports = parse;
module.exports.default = parse;

/* eslint-disable no-cond-assign, eslint-comments/disable-enable-pair, no-param-reassign, @typescript-eslint/restrict-plus-operands, node/no-unsupported-features/es-syntax  */
const fastUrlDecode = require('fast-decode-uri-component');

/**
 * Parser string or URL encoded string to object
 * @param {String} str Input string
 * @param {String} delimiter Delimiter during parsing
 * @param {Object} options Parser options
 * @param {Boolean} options.enableParser Enable deep parser for handling complex queries
 *
 * @default delimiter & Default value of delimiter
 * @default options.enableParser true Deep parser default state
 *
 * @example
 * parse('foo=bar')
 */
const defaultOptions = { enableParser: true };
// eslint-disable-next-line complexity, max-lines-per-function
function parse(str, delimiter = '&', options = defaultOptions) {
  if (str.indexOf('%') !== -1) {
    str = fastUrlDecode(str);
  }
  if (str.length < 3 || str.indexOf('=') === -1) {
    return null;
  }

  let index = -1;
  let lastIndex = 0;
  const returns = {};

  let field;
  let keyIndex;
  let fieldIndex;
  let key;
  let value;

  let values;

  while ((index = str.indexOf(delimiter, lastIndex)) !== -1) {
    field = str.substring(lastIndex, index);

    keyIndex = field.indexOf('=');
    key = field.substr(0, keyIndex);
    value = field.substr(keyIndex + 1);

    if (options.enableParser && key.indexOf('[]') !== -1) {
      key = key.substr(0, key.length - 2);
      values = returns[key] || [];

      values.push(value);
    } else if (options.enableParser && (keyIndex = key.indexOf('[')) !== -1) {
      fieldIndex = key.indexOf(']', keyIndex);
      field = key.substring(keyIndex + 1, fieldIndex);
      key = key.substring(0, keyIndex);
      values = returns[key] || {};

      values[field] = value;
    } else {
      values = value;
    }

    returns[key] = values;
    values = null;

    lastIndex = index + 1;
  }

  field = str.substr(lastIndex);
  keyIndex = field.indexOf('=');
  key = field.substr(0, keyIndex);
  value = field.substr(keyIndex + 1);

  if (options.enableParser && key.indexOf('[]') !== -1) {
    key = key.substr(0, key.length - 2);
    values = returns[key] || [];

    values.push(value);
  } else if (options.enableParser && (keyIndex = key.indexOf('[')) !== -1) {
    fieldIndex = key.indexOf(']');
    field = key.substring(keyIndex + 1, fieldIndex);
    key = key.substring(0, keyIndex);
    values = returns[key] || {};

    values[field] = value;
  } else {
    values = value;
  }

  returns[key] = values;
  values = null;

  return returns;
}

module.exports = parse
module.exports.default = parse

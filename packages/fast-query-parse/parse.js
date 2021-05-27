/* eslint-disable no-cond-assign, eslint-comments/disable-enable-pair, no-param-reassign, @typescript-eslint/restrict-plus-operands */
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
// eslint-disable-next-line complexity, max-lines-per-function
const defaultOptions = { enableParser: true };
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

const handleObject = (properties, required, parent) => {
  let code_eval = '';

  if (!parent) {
    code_eval += `
  key = str.substring(0, str.indexOf('['));
  `;
  } else {
    code_eval += 'key = "' + parent + '"';
  }

  for (let property in properties) {
    const item = properties[property];

    switch (item.type) {
      case 'number':
      case 'string':
      case 'boolean': {
        code_eval += `
        index = str.indexOf('[${property}]');
        if (index !== -1) {
          values["${property}"] = ${
          item.type === 'number' ? '+' : ''
        }str.substring(index + ${property.length + 3})
        }
        `;
        break;
      }
      case 'object': {
        if (property) {
          code_eval += `
        if (!values['${property}']) {
          values[key] = {['${property}']: {}};
          values = values[key]['${property}']
        }
        `;
        }
        code_eval += handleObject(item.properties, item.required, property);

        break;
      }
    }
  }

  return code_eval;
};
const parseSchema = (schema = {}) => {
  let code_eval = `
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

  let values = returns;
  `;

  switch (schema.type) {
    case 'object': {
      code_eval += handleObject(schema.properties, schema.required);

      break;
    }
    case 'array': {
      //

      break;
    }
    default: {
      break;
    }
  }
  /*for (let i = 0; i < 10; i++) {
    code_eval += `
    index = str.indexOf(delimiter, lastIndex);
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

  lastIndex = index + 1;
  `;
  }*/

  code_eval += `
  return returns;
  `;

  return new Function(
    'str',
    "delimiter = '&'",
    `options = ${JSON.stringify(defaultOptions)}`,
    code_eval
  );
};

console.log(
  '#2',
  parseSchema({
    type: 'object',
    properties: {
      b: {
        type: 'object',
        properties: {
          c: {
            type: 'object',
            properties: {
              d: {
                type: 'object',
                properties: {
                  e: { type: 'number' }
                }
              }
            }
          }
        }
      }
    }
  })('a[b][b][c][d][e]=5')
);
console.log(parse('a[b][b][c][d][e]=5'));

module.exports.parse = parse;
module.exports.parseSchema = parseSchema;

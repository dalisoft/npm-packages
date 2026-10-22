function normalizeArg(type) {
  if (typeof type !== 'string') {
    return type;
  }
  if (
    type.charAt(0) === '{' ||
    (type.charAt(0) === '[' && typeof JSON !== 'undefined')
  ) {
    return JSON.parse(type);
  }
  if (Number.isNaN(+type)) {
    return type;
  }
  return +type;
}
function parse(string) {
  const result = {};
  if (!string) {
    return result;
  }
  const parts = string.split('; ');

  if (parts.length === 0) {
    return result;
  }

  parts.map((part) => {
    const [key, value] = part.trim().split('=');
    result[key] = normalizeArg(decodeURIComponent(value));
  });

  return result;
}

function stringify(obj) {
  let str = '';
  for (const key in obj) {
    let value;
    if (typeof obj[key] !== 'string') {
      value = JSON.stringify(obj[key]);
    } else {
      value = obj[key];
    }
    str += `${key}=${value}`;
  }
  return str;
}

function getFromHeaders(headers) {
  if (!headers) {
    return {};
  }
  return parse(headers.cookie);
}

function set(res, key, value, options = {}) {
  if (Array.isArray(key)) {
    return key.forEach((key) => {
      setCookie(res, key[0], key[1], options);
    });
  }
  res.setCookie(key, value, options);
}

function remove(res, key, value = '', options = {}) {
  if (Array.isArray(key)) {
    return key.forEach((key) => {
      removeCookie(res, key, value, options);
    });
  }
  res.setCookie(
    key,
    value,
    Object.assign({}, options, {
      expiresIn: Date.now() - 1000
    })
  );
}

export { getFromHeaders, parse, remove, set, stringify };

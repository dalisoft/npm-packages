const { equal, strictEqual } = require('../utils/equal-path.js');
const segmentsSlice = require('../utils/segment.js');

/**
 * @type {import('./match')}
 */
const match = (path, { compact, ignoreTrailingSlash = true } = {}) => {
  const { segments, filled } = segmentsSlice(path, compact);

  if (filled.length > 0) {
    let aotJit = `function matchPath(pathname) {
        let i;
        let lastIndex = 1;
        let isValid = true;

        let value;`;

    for (const segment of segments) {
      aotJit += `
        if (!isValid) { return false; }`;

      if (!segment.segment) {
        aotJit += `
          value = pathname.substring(lastIndex, lastIndex + ${segment.size});`;
        aotJit += `
          isValid = value === '${segment.name}';
          lastIndex += ${segment.size + 1};`;

        continue;
      }

      aotJit += `
          i = pathname.indexOf('/', lastIndex);`;

      if (segment.last) {
        aotJit += `
          value = i === -1 ? pathname.substring(lastIndex) : pathname.substring(lastIndex, i);`;
      } else {
        aotJit += `
          if (i < ${segment.position}) { return false; }
          value = pathname.substring(lastIndex, i);`;
      }

      aotJit += `
          isValid = value.length > 0;
          lastIndex = i + 1;`;
    }
    aotJit += `
        return isValid;
    }`;

    return new Function(`return ${aotJit}`)();
  }

  return ignoreTrailingSlash
    ? (url) => equal(url, path)
    : (url) => strictEqual(url, path);
};

module.exports = match;

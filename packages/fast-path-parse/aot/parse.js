const segmentsSlice = require('../utils/segment.js');

/**
 * @type {import('./parse')}
 */
const parse = (path, compact) => {
  const { segments, filled } = segmentsSlice(path, compact);

  if (filled.length > 0) {
    let aotJit = `function compilePath(pathname, params = {}) {
        let uri = pathname;

        let i;
        let lastIndex = 1;
        let value;`;

    for (const segment of segments) {
      aotJit += `
        i = uri.indexOf('/', lastIndex);
        `;

      if (segment.last) {
        aotJit +=
          'i === -1 ? value = uri.substring(lastIndex) : value = uri.substring(lastIndex, i);';
      } else {
        aotJit += `if (i < ${segment.position}) { return params; }`;
        aotJit += 'value = uri.substring(lastIndex, i);';
      }

      if (segment.segment) {
        aotJit += `
          params['${segment.name}'] = value;
          `;
      }

      aotJit += `lastIndex = i + 1;
`;
    }

    aotJit += `
        return params
  }`;

    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return new Function(`return ${aotJit}`)();
  }

  return (_, params = {}) => params;
};

module.exports = parse;

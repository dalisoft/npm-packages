/**
 * Parses every segment and makes it more clean
 * @param {string} name
 * @param {(() => number)} getIndex
 * @param {number} position
 */

// eslint-disable-next-line complexity
const parseSegment = (name, getIndex, position = 1) => {
  if (name === '*' || name === '(.*)') {
    return {
      name: `*${getIndex()}`,
      segment: true,
      position: position + 2,
      size: 2
    };
  }
  if (name.charAt(0) === ':') {
    return {
      name: name.substring(1),
      segment: true,
      position: position + 2,
      size: 2
    };
  }
  if (name.charAt(0) === '<' && name.charAt(name.length - 1) === '>') {
    return {
      name: name.substring(1, name.length - 1),
      segment: true,
      position: position + 2,
      size: 2
    };
  }

  return {
    name,
    segment: false,
    position: position + name.length + 1,
    size: name.length
  };
};

/**
 * Parses route string into segments and parses it
 * @type {import('./segment')}
 * @param path A path to parse
 * @example
 * ```ts
 * segmentsSlice('/foo/bar').segments
 * // [{name: 'foo', segment: false, size: 3, last: false}, {name: 'bar', segment: false, size: 3, last: true}]
 * ```
 */
module.exports = function segmentsSlice(path) {
  let INDEX = 1;

  /**
   * @type {import('./segment').ISegment[]}
   */
  const segments = path
    .substring(1)
    .split('/')
    .map((name) => parseSegment(name, () => INDEX++))
    .filter((segment) => segment.name)
    .map((segment, i, self) => ({
      ...segment,
      last: i + 1 === self.length,
      position: i > 0 ? self[i - 1].position : 1
    }));
  const segmentsFilled = segments.filter((segment) => segment.segment);

  return { segments, filled: segmentsFilled, length: segments.length };
};

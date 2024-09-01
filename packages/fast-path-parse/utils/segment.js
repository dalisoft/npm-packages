/**
 * Parses every segment and makes it more clean
 * @param {string} name
 * @param {(() => number)} getIndex
 * @param {number} position
 */
const parseSegment = (name, getIndex, position = 1) => {
  if (name === '*' || name === '(.*)') {
    return { name: `*${getIndex()}`, segment: true, position: position + 2 };
  }
  if (name.charAt(0) === ':') {
    return { name: name.substring(1), segment: true, position: position + 2 };
  }

  return { name, segment: false, position: position + name.length + 1 };
};

/**
 * Parses route string into segments and parses it
 * @param {string} path
 * @example
 * ```ts
 * segmentsSlice('/foo/bar').segments
 * // [{name: 'foo', segment: false, last: false}, {name: 'bar', segment: false, last: true}]
 * ```
 */
module.exports = function segmentsSlice(path) {
  let INDEX = 1;

  /**
   * @type {Array<{name: string; segment: boolean, last: boolean, position: number}>}
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

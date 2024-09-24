/**
 * Parses every segment and makes it more clean
 * @param {string} name
 * @param {(() => number)} getIndex
 * @param {number} position
 */

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
 * @param {import('./segment').ISegment[]} segments
 */
const mergeStaticSegments = (segments) => {
  let i = 0;

  /**
   * @type {import('./segment').ISegment[]}
   */
  const compactSegments = segments.slice(0);

  while (i < compactSegments.length) {
    const current = compactSegments[i];
    const next = compactSegments[i + 1];

    if (!next) {
      break;
    }

    if (!current.segment && !next.segment) {
      current.name += `/${next.name}`;
      current.size += next.size + 1;

      if (next.last) {
        current.last = next.last;
      }

      compactSegments.splice(i + 1, 1);
    } else {
      i++;
    }
  }

  return compactSegments;
};

/**
 * @type {import('./segment')}
 */
module.exports = function segmentsSlice(path, compact = false) {
  let INDEX = 1;
  let POSITION = 1;

  /**
   * @type {import('./segment').ISegment[]}
   */
  const rawSegments = path
    .substring(1)
    .split('/')
    .map((name) => {
      const segment = parseSegment(name, () => INDEX++, POSITION);

      POSITION = segment.position;

      return segment;
    })
    .filter((segment) => segment.name)
    .map((segment, i, self) => ({
      ...segment,
      last: i + 1 === self.length,
      position: i > 0 ? self[i - 1].position : 1
    }));
  const segments = compact ? mergeStaticSegments(rawSegments) : rawSegments;
  const segmentsFilled = segments.filter((segment) => segment.segment);

  return { segments, filled: segmentsFilled, length: segments.length };
};

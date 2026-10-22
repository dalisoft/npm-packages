// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable max-lines */

import equalArrLen from './equal-arr-len.js';

/**
 * Parses every segment and makes it more clean
 * @param {string} name
 * @param {(() => number)} getIndex
 * @param {number} position
 */
// eslint-disable-next-line complexity, max-lines-per-function
const parseSegment = (name, getIndex, position = 1) => {
  /**
   * example, `/foo/*` and it can handle `/foo/bar`
   * segment in this case will be `*1` or `*2`
   */
  if (name === '*' || name === '(.*)') {
    return {
      name: `*${getIndex()}`,
      position: position + 2,
      segment: true,
      size: 2
    };
  }

  /**
   * example, `/foo/*` and it can handle `/foo/bar`
   * segment in this case will be `*1` or `*2`
   */
  if (name.charAt(0) === ':') {
    return {
      name: name.substring(1),
      position: position + 2,
      segment: true,
      size: 2
    };
  }
  if (name.charAt(0) === '<' && name.charAt(name.length - 1) === '>') {
    return {
      name: name.substring(1, name.length - 1),
      position: position + 2,
      segment: true,
      size: 2
    };
  }
  if (name.indexOf('[') !== -1 && name.charAt(name.length - 1) === ']') {
    const first = name.indexOf('[');
    const names = name.substring(first + 1, name.length - 1).split(',');

    if (equalArrLen(names)) {
      return {
        name: `*${getIndex()}`,
        position: position + 2,
        segment: true,
        size: names[0].length
      };
    }

    return {
      name: `*${getIndex()}`,
      position: position + 2,
      segment: true,
      size: 2
    };
  }
  if (name.indexOf('{') !== -1 && name.charAt(name.length - 1) === '}') {
    const first = name.indexOf('{');
    const names = name.substring(first + 1, name.length - 1).split(',');

    if (equalArrLen(names)) {
      return {
        name: `*${getIndex()}`,
        position: position + 2,
        segment: true,
        size: names[0].length
      };
    }

    return {
      name: `*${getIndex()}`,
      position: position + 2,
      segment: true,
      size: 2
    };
  }

  return {
    name,
    position: position + name.length + 1,
    segment: false,
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
 * @type {import('./segment').default}
 */
export default function segmentsSlice(path, compact = false) {
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

  return { filled: segmentsFilled, length: segments.length, segments };
}

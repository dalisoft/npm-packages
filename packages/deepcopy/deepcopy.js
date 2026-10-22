/**
 * Deeply clones plain objects, arrays, `Date` and `Map` instances
 * @template T
 * @param {T} source Value to clone
 * @returns {T} Cloned value
 */
export default function deepCopy(source) {
  if (source === null || typeof source !== 'object') {
    return source;
  }
  if (typeof Date !== 'undefined' && source instanceof Date) {
    copy = new Date();
    copy.setTime(source.getTime());
    return copy;
  }
  if (Array.isArray(source)) {
    return source.map(deepCopy);
  }
  if (typeof Map !== 'undefined' && source instanceof Map) {
    return new Map(Array.from(source).map(deepCopy));
  }
  if (typeof source === 'object') {
    var copy = {};
    for (var key in source) {
      if (typeof source[key] === 'object' && source[key] !== null) {
        copy[key] = deepCopy(source[key]);
      } else {
        copy[key] = source[key];
      }
    }
    return copy;
  }
}

import area from './area.js';
import boundingBox from './boundingBox.js';
import { sqrt } from './helpers.js';
import length from './length.js';

const mapList = {
  auto(a, b) {
    return (
      b.length - a.length ||
      sqrt(boundingBox(a).center) - sqrt(boundingBox(b).center) ||
      length(b) - length(a) ||
      area(b) - area(a)
    );
  },
  byBBox(a, b) {
    const bb = boundingBox(b).center;

    const aa = boundingBox(a).center;

    return bb.x + bb.y - (aa.x + aa.y);
  },
  byDirection(a, b) {
    return area(b) - area(a);
  },
  byLength(a, b) {
    return length(b) - length(a);
  },
  byPoint(a, b) {
    return b.length - a.length;
  },
  bySqrt(a, b) {
    return sqrt(boundingBox(a).center) - sqrt(boundingBox(b).center);
  },
  byX(b, a) {
    return b[0].x - a[0].x;
  },
  byY(b, a) {
    return b[0].y - a[0].y;
  },
  default() {
    return 0;
  },
  get(type) {
    return typeof type === 'function'
      ? type
      : typeof type === 'string' && type in mapList
        ? mapList[type]
        : null;
  }
};
export default mapList;

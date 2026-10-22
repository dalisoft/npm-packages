import area from './area.js';
import { applyFuncToShapes } from './helpers.js';
import reverse from './reverse.js';

const autoReversePoints = (fromShape, toShape) => {
  const fromShapeArea = area(fromShape);
  const toShapeArea = area(toShape);
  if (
    (fromShapeArea > 0 && toShapeArea < 0) ||
    (toShapeArea > 0 && fromShapeArea < 0)
  ) {
    fromShape = reverse(fromShape);
  }
  return fromShape;
};

const autoReverse = (fromShape, toShape) =>
  applyFuncToShapes(autoReversePoints, fromShape, toShape);

export default autoReverse;

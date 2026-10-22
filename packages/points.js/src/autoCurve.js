import { applyFuncToShapes } from './helpers.js';

const autoCurveSinglePoint = (fromShape, toShape) => {
  for (let index = 0, len = fromShape.length; index < len; index++) {
    const point = fromShape[index];
    const point2 = toShape[index];
    if (point2 && !point.curve && point2.curve && !point.moveTo) {
      const prevPoint = index === 0 ? null : fromShape[index - 1];
      point.curve = {
        type: 'cubic',
        x1: prevPoint.x,
        x2: point.x,
        y1: prevPoint.y,
        y2: point.y
      };
    }
  }
  return fromShape;
};

export const autoCurvePoint = (fromShape, toShape) =>
  applyFuncToShapes(autoCurveSinglePoint, fromShape, toShape);

const autoCurvePoints = (fromShape, toShape) => {
  fromShape = autoCurveSinglePoint(fromShape, toShape);
  return fromShape;
};

const autoCurve = (fromShape, toShape) =>
  applyFuncToShapes(autoCurvePoints, fromShape, toShape);

export default autoCurve;

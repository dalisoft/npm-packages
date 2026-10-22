/**
 * Checks if all array values length are same
 * @param {Array<string>} values
 * @returns {boolean}
 */
export default (values) => {
  if (values.length <= 1) {
    return false;
  }

  const firstLength = values[0].length;

  if (values.length === 2) {
    return firstLength === values[1].length;
  }
  if (values.length === 3) {
    return firstLength === values[1].length && firstLength === values[2].length;
  }

  for (let i = 1, len = values.length; i < len; i++) {
    if (values[i].length !== firstLength) {
      return false;
    }
  }

  return true;
};

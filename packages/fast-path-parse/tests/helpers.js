const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const runTest = (test, callee, is_parent = true) => {
  const { name, input, test_input, result, variants, children } = test;

  if (variants) {
    describe(name, () => {
      for (const [inputTemplate, testInputTemplate] of variants) {
        const inputIt =
          typeof inputTemplate === 'string'
            ? inputTemplate.replace(/%s/g, input)
            : input;
        const testInputIt =
          typeof testInputTemplate === 'string'
            ? testInputTemplate.replace(/%s/g, test_input)
            : test_input;

        it(inputIt, () => {
          if (typeof result === 'object') {
            assert.deepEqual(callee(inputIt, testInputIt), result);
          } else {
            assert.equal(callee(inputIt, testInputIt), result);
          }
        });
      }
    });
  } else if (children) {
    describe(name, () => {
      for (const child of children) {
        runTest(child, callee, false);
      }
    });
  } else if (!is_parent) {
    it(name, () => {
      if (typeof result === 'object') {
        assert.deepEqual(callee(input, test_input), result);
      } else {
        assert.equal(callee(input, test_input), result);
      }
    });
  } else {
    describe(input, () => {
      it(test_input, () => {
        if (typeof result === 'object') {
          assert.deepEqual(callee(input, test_input), result);
        } else {
          assert.equal(callee(input, test_input), result);
        }
      });
    });
  }
};

module.exports = { runTest };

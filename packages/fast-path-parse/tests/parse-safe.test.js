const { describe } = require('node:test');
const testsParseData = require('./data/parse.js');
const testsParseSecurityData = require('./data/parse.js');
const parsePathname = require('../runtime/parse.js');
const { runTest } = require('./helpers.js');

describe('fast-path-parse/parse safe', () => {
  for (const test of testsParseData) {
    runTest(test, (input, output) => parsePathname(input)(output));
  }
});

describe('fast-path-parse/parse security', () => {
  for (const test of testsParseSecurityData) {
    runTest(test, (input, output) => parsePathname(input)(output));
  }
});

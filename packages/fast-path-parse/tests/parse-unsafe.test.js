const { describe } = require('node:test');
const testsParseData = require('./data/parse.js');
const testsParseSecurityData = require('./data/parse.js');
const compilePathname = require('../src/aot/parse.js');
const { runTest } = require('./helpers.js');

describe('fast-path-parse/parse unsafe', () => {
  for (const test of testsParseData) {
    runTest(test, (input, output) => compilePathname(input)(output));
  }
});

describe('fast-path-parse/parse unsafe security', () => {
  for (const test of testsParseSecurityData) {
    runTest(test, (input, output) => compilePathname(input)(output));
  }
});

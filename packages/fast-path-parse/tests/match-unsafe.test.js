const { describe } = require('node:test');
const match = require('../aot/match.js');
const testsMatchData = require('./data/match.js');
const testsMatchSecurityData = require('./data/match.security.js');
const { runTest } = require('./helpers.js');

describe('fast-path-parse/match unsafe', () => {
  for (const test of testsMatchData) {
    runTest(test, (input, output) => match(input)(output));
  }
});

describe('fast-path-parse/match unsafe security', () => {
  for (const test of testsMatchSecurityData) {
    runTest(test, (input, output) => match(input)(output));
  }
});

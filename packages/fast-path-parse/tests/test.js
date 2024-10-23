// test-match.js
const match = require('../src/runtime/match.js');

const testPath = '/foo/:id';
const inputArgs = { compact: false, ignoreTrailingSlash: false };
const testInput = '/foo/123/';


// const resultWithSlash = match(testPath, inputArgs)(testInput + '/');
const resultWithoutSlash = match(testPath, inputArgs)(testInput);

// console.log('Result with slash:', resultWithSlash);  // Ожидаем true
console.log('Result without slash:', resultWithoutSlash);  // Ожидаем false
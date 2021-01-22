// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const esm = require('./esm');
const cjs = require('./cjs');

// eslint-disable-next-line security-node/detect-non-literal-require-calls
const pkg = require(path.join(__dirname, `../../package.json`));

if (pkg.type === 'module') {
  module.exports = esm;
} else {
  module.exports = cjs;
}

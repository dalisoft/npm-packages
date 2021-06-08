// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console, node/no-unsupported-features/es-syntax, security-node/detect-crlf */
import Benchmark from 'benchmark';
import fastPathParse from 'fast-path-parse';
import pathToRegExp from 'path-to-regexp';
import pathToTree from 'path-to-tree';

const path = '/user/:id/edit/:page';

const paramsId = ['id', 'page'];
const regExp = new RegExp(
  // eslint-disable-next-line security-node/non-literal-reg-expr
  `^${path.replace(':id', '([^/]+?)').replace(':page', '([^/]+?)')}\\/?$`,
  'i'
);

const fastPath = fastPathParse(path);

const pathKeys = [];
const compiledPathRegEx = pathToRegExp.pathToRegexp(path, pathKeys);

const pathMatches = pathToRegExp.match(path);

const tree = pathToTree();

tree.add(path, 2);

// Suite
const suite = new Benchmark.Suite();
suite.add('fast regexp exec', () => {
  const params = {};
  const exec = regExp.exec('/user/1234/edit/weather');

  for (let p = 0, lenp = paramsId.length; p < lenp; p += 1) {
    const key = paramsId[p];
    const value = exec[p + 1];

    params[key] = value;
  }
});
suite.add('fast path parse', () => {
  fastPath('/user/1234/edit/weather');
});
suite.add('path-to-regexp exec', () => {
  const params = {};
  const exec = compiledPathRegEx.exec('/user/1234/edit/weather');

  for (let p = 0, lenp = pathKeys.length; p < lenp; p += 1) {
    const key = pathKeys[p].name;
    const value = exec[p + 1];

    params[key] = value;
  }
});
suite.add('path-to-regexp match', () => {
  pathMatches('/user/1234/edit/weather');
});
suite.add('path-to-tree', () => {
  tree.find('/user/1234/edit/weather');
});
suite.on('cycle', (e) => {
  console.log(e.target.toString());
});
suite.on('complete', function onComplete() {
  console.log(`Fastest is ${this.filter('fastest').map('name')}`);
});

suite.run();

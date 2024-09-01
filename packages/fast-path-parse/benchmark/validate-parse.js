import benny from 'benny';
import fastPathCompile from '../aot/match.js';
import fastPathParse from '../runtime/match.js';
import pathToRegExp from 'path-to-regexp';
import pathToTree from 'path-to-tree';

const path = '/user/:id/edit/:page';

const fastPath = fastPathParse(path);
const fastPath2 = fastPathCompile(path);
const pathMatches = pathToRegExp.match(path);
const tree = pathToTree();
tree.add(path, 2);

// Suite
benny.suite(
  'Validation/Match',
  benny.add('fast path match', () => {
    fastPath('/user/1234/edit/weather');
  }),
  benny.add('fast path compiled match', () => {
    fastPath2('/user/1234/edit/weather');
  }),
  benny.add('path-to-regexp match', () => {
    pathMatches('/user/1234/edit/weather');
  }),
  benny.add('path-to-tree', () => {
    tree.find('/user/1234/edit/weather');
  }),
  benny.cycle(),
  benny.complete()
);

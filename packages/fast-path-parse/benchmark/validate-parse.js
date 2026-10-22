import { add, complete, cycle, suite } from 'benny';
import pathToRegExp from 'path-to-regexp';
import pathToTree from 'path-to-tree';
import fastPathCompile from '../src/aot/match.js';
import fastPathParse from '../src/runtime/match.js';

const path = '/user/:id/edit/:page';

const fastPath = fastPathParse(path);
const fastPath2 = fastPathCompile(path);
const pathMatches = pathToRegExp.match(path);
const tree = pathToTree();
tree.add(path, 2);

// Suite
suite(
  'Validation/Match',
  add('fast path match', () => {
    fastPath('/user/1234/edit/weather');
  }),
  add('fast path compiled match', () => {
    fastPath2('/user/1234/edit/weather');
  }),
  add('path-to-regexp match', () => {
    pathMatches('/user/1234/edit/weather');
  }),
  add('path-to-tree', () => {
    tree.find('/user/1234/edit/weather');
  }),
  cycle(),
  complete()
);

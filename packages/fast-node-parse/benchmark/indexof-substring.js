import { suite, add, cycle, complete } from 'benny';

const inputString = '/foo';
const prebuiltRegEx = new RegExp(inputString.substring(1), 'i');

suite(
  'string match segment',
  add('indexof', () => {
    const i = inputString.indexOf('foo');

    if (i !== -1) {
      //
    }
  }),
  add('substring', () => {
    const segment = inputString.substring(1, 4);

    if (segment) {
      //
    }
  }),
  add('test', () => {
    if (prebuiltRegEx.test('foo')) {
      //
    }
  }),
  cycle(),
  complete()
);

suite(
  'string get segment',
  add('indexof', () => {
    const i = inputString.indexOf('foo');
    const segment = inputString.substring(i);

    if (i !== -1 && segment === 'foo') {
      //
    }
  }),
  add('substring', () => {
    const segment = inputString.substring(1, 4);

    if (segment === 'foo') {
      //
    }
  }),
  add('exec', () => {
    const segment = prebuiltRegEx.exec(inputString);

    if (segment?.[0] === 'foo') {
      //
    }
  }),
  cycle(),
  complete()
);

import benny from 'benny';
import fastQueryParse from '../parse.js';
import qs from 'qs';
import querystring from 'node:querystring';

const QS = 'foo=bar&loop[]=doing&shitty[foo]=1&shitty[bar]=2&loop[1]=something';

// Suite
benny.suite(
  'parse simple',
  benny.add('querystring.parse', () => {
    querystring.parse(QS);
  }),
  benny.add('fast-query-parse', () => {
    fastQueryParse(QS);
  }),
  benny.add('ada URL', () => {
    new URL(`http://dummyurl.com?${QS}`).searchParams;
  }),
  benny.cycle(),
  benny.complete()
);

// Suite
benny.suite(
  'parse complex',
  benny.add('qs.parse', () => {
    qs.parse(QS, { depth: 1 });
  }),
  benny.add('fast-query-parse', () => {
    fastQueryParse(QS, true);
  }),
  benny.cycle(),
  benny.complete()
);

import Benchmark from 'benchmark';
import fastQueryParse from 'fast-query-parse';
import qs from 'qs';
import querystring from 'querystring';

const QS = 'foo=bar&loop[]=doing&shitty[foo]=1&shitty[bar]=2';
const qsRexEx = /([A-Za-z0-9[\]]+)?=([A-Za-z0-9[\]]+)/gi;

function parseQS(str) {
  let match;
  const returns = {};
  while ((match = qsRexEx.exec(str)) !== null) {
    returns[match[1]] = match[2];
  }

  return returns;
}

function splitQS(str) {
  const values = str.split('&');
  const returns = {};

  for (let i = 0, len = values.length; i < len; i += 1) {
    const [key, value] = values[i].split('=');
    returns[key] = value;
  }

  return returns;
}

console.log({
  'qs.parse': qs.parse(QS),
  'querystring.parse': querystring.parse(QS),
  'fast-query-parse': fastQueryParse(QS),
  'fqp-once': fastQueryParse('foo[]=bar'),
  parse_qs: parseQS(QS),
  split_qs: splitQS(QS)
});

// Suite
const suite = new Benchmark.Suite();
suite.add('querystring.parse', () => {
  querystring.parse(QS);
});
suite.add('qs.parse', () => {
  qs.parse(QS);
});
suite.add('parseQS', () => {
  parseQS(QS);
});
suite.add('fast-query-parse', () => {
  fastQueryParse(QS);
});
suite.add('splitQS', () => {
  splitQS(QS);
});
suite.on('cycle', (e) => {
  console.log(e.target.toString());
});
suite.on('complete', function () {
  console.log(`Fastest is ${this.filter('fastest').map('name')}`);
});

suite.run();

import { parse } from 'node:querystring';

export default () => {
  return (_res, req) => {
    req.query = parse(req.getQuery());
  };
};

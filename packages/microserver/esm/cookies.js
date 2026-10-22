import cookie from 'cookie';

export default () => {
  return (_res, req) => {
    const _cookie = req.headers?.cookie || req.getHeader('cookie');

    req.cookies = cookie.parse(_cookie);
  };
};

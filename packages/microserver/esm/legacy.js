export const useConnectMiddleware = (middleware) => {
  return (res, req) =>
    new Promise((resolve) =>
      middleware(req, res, (err, done) => {
        if (err) {
          res.end(JSON.stringify({ code: err.code, message: err.message }));
          return resolve(res);
        }
        if (done !== false) {
          return resolve();
        }
        return undefined;
      })
    );
};

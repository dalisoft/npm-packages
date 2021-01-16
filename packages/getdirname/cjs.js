module.exports = function getdirname() {
  try {
    throw new Error('__get__dirname__');
  } catch (e) {
    const currStackTrace = e.stack.split('at ');

    let stackTraceRun = currStackTrace.shift();
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (currStackTrace[0].indexOf(' (/') !== -1) {
        stackTraceRun = currStackTrace.shift();
      } else {
        break;
      }
    }

    if (!stackTraceRun) {
      return null;
    }

    const lastSlashIndex = stackTraceRun.lastIndexOf('/');
    let firstBrace = stackTraceRun.indexOf(' (/');

    if (firstBrace !== -1 && lastSlashIndex !== -1) {
      firstBrace += 2;
      const realdirname = stackTraceRun.substr(
        firstBrace,
        lastSlashIndex - firstBrace
      );
      return realdirname;
    }
  }

  return null;
};

import { createBrotliCompress, createGzip, createDeflate } from 'zlib';

const priority = ['gzip', 'br', 'deflate'];

export default function (stream, contentEncoding) {
  const encoding = priority.find(
    (encoding) => contentEncoding && contentEncoding.indexOf(encoding) !== -1
  );

  const compression =
    encoding === 'br'
      ? createBrotliCompress()
      : encoding === 'gzip'
      ? createGzip()
      : encoding === 'deflate'
      ? createDeflate()
      : null;

  if (compression) {
    stream.pipe(compression);

    this.writeHeader('Content-Encoding', encoding);
  }

  return compression;
}

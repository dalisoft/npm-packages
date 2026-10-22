import crypto from 'node:crypto';

const paths = Array.from(
  { length: 1024 },
  () =>
    `/foo/bar/baz/qux/quux/corge/grault/garply/waldo/fred${crypto.randomBytes(4).toString('hex')}`
);
const charCodeIndex = (full, seg, pos = 0) => {
  const len = seg.length;
  const end = pos + len;

  if (end > full.length) {
    return false;
  }

  let index = 0;
  while (index < len) {
    if (full.charCodeAt(pos + index) !== seg.charCodeAt(index)) {
      return false;
    }
    index++;
  }
  return true;
};
const simdCompile = (seg) => {
  const n = seg.length;
  // precompute codes once
  const c0 = seg.charCodeAt(0);
  const c1 = seg.charCodeAt(1);
  const c2 = seg.charCodeAt(2);
  const c3 = seg.charCodeAt(3);
  const c4 = seg.charCodeAt(4);
  const c5 = seg.charCodeAt(5);
  const c6 = seg.charCodeAt(6);
  const c7 = seg.charCodeAt(7);

  switch (n) {
    case 1:
      return (s, p) => s.charCodeAt(p) === c0;
    case 2:
      return (s, p) => s.charCodeAt(p) === c0 && s.charCodeAt(p + 1) === c1;
    case 3:
      return (s, p) =>
        s.charCodeAt(p) === c0 &&
        s.charCodeAt(p + 1) === c1 &&
        s.charCodeAt(p + 2) === c2;
    case 4:
      return (s, p) =>
        s.charCodeAt(p) === c0 &&
        s.charCodeAt(p + 1) === c1 &&
        s.charCodeAt(p + 2) === c2 &&
        s.charCodeAt(p + 3) === c3;
    case 5:
      return (s, p) =>
        s.charCodeAt(p) === c0 &&
        s.charCodeAt(p + 1) === c1 &&
        s.charCodeAt(p + 2) === c2 &&
        s.charCodeAt(p + 3) === c3 &&
        s.charCodeAt(p + 4) === c4;
    case 6:
      return (s, p) =>
        s.charCodeAt(p) === c0 &&
        s.charCodeAt(p + 1) === c1 &&
        s.charCodeAt(p + 2) === c2 &&
        s.charCodeAt(p + 3) === c3 &&
        s.charCodeAt(p + 4) === c4 &&
        s.charCodeAt(p + 5) === c5;
    case 7:
      return (s, p) =>
        s.charCodeAt(p) === c0 &&
        s.charCodeAt(p + 1) === c1 &&
        s.charCodeAt(p + 2) === c2 &&
        s.charCodeAt(p + 3) === c3 &&
        s.charCodeAt(p + 4) === c4 &&
        s.charCodeAt(p + 5) === c5 &&
        s.charCodeAt(p + 6) === c6;
    case 8:
      return (s, p) =>
        s.charCodeAt(p) === c0 &&
        s.charCodeAt(p + 1) === c1 &&
        s.charCodeAt(p + 2) === c2 &&
        s.charCodeAt(p + 3) === c3 &&
        s.charCodeAt(p + 4) === c4 &&
        s.charCodeAt(p + 5) === c5 &&
        s.charCodeAt(p + 6) === c6 &&
        s.charCodeAt(p + 7) === c7;
    default:
      return (s, p) => {
        for (let i = 0; i < n; i++)
          if (s.charCodeAt(p + i) !== seg.charCodeAt(i)) return false;
        return true;
      };
  }
};
const compileBytes = (needleBuf) => {
  const n = needleBuf.length;
  const b0 = needleBuf[0];
  const b1 = needleBuf[1];
  const b2 = needleBuf[2];
  const b3 = needleBuf[3];
  const b4 = needleBuf[4];
  const b5 = needleBuf[5];
  const b6 = needleBuf[6];
  const b7 = needleBuf[7];

  switch (n) {
    case 1:
      return (buf, p) => buf[p] === b0;
    case 2:
      return (buf, p) => buf[p] === b0 && buf[p + 1] === b1;
    case 3:
      return (buf, p) =>
        buf[p] === b0 && buf[p + 1] === b1 && buf[p + 2] === b2;
    case 4:
      return (buf, p) =>
        buf[p] === b0 &&
        buf[p + 1] === b1 &&
        buf[p + 2] === b2 &&
        buf[p + 3] === b3;
    case 5:
      return (buf, p) =>
        buf[p] === b0 &&
        buf[p + 1] === b1 &&
        buf[p + 2] === b2 &&
        buf[p + 3] === b3 &&
        buf[p + 4] === b4;
    case 6:
      return (buf, p) =>
        buf[p] === b0 &&
        buf[p + 1] === b1 &&
        buf[p + 2] === b2 &&
        buf[p + 3] === b3 &&
        buf[p + 4] === b4 &&
        buf[p + 5] === b5;
    case 7:
      return (buf, p) =>
        buf[p] === b0 &&
        buf[p + 1] === b1 &&
        buf[p + 2] === b2 &&
        buf[p + 3] === b3 &&
        buf[p + 4] === b4 &&
        buf[p + 5] === b5 &&
        buf[p + 6] === b6;
    case 8:
      return (buf, p) =>
        buf[p] === b0 &&
        buf[p + 1] === b1 &&
        buf[p + 2] === b2 &&
        buf[p + 3] === b3 &&
        buf[p + 4] === b4 &&
        buf[p + 5] === b5 &&
        buf[p + 6] === b6 &&
        buf[p + 7] === b7;
    default:
      return (buf, p) => {
        if (p + n > buf.length) return false;
        for (let i = 0; i < n; i++)
          if (buf[p + i] !== needleBuf[i]) return false;
        return true;
      };
  }
};
const compileBytesXor = (needle) => {
  const n = needle.length;
  const b0 = needle[0];
  const b1 = needle[1];
  const b2 = needle[2];
  const b3 = needle[3];
  const b4 = needle[4];
  const b5 = needle[5];
  const b6 = needle[6];
  const b7 = needle[7];

  switch (n) {
    case 3:
      return (buf, p) =>
        ((buf[p] ^ b0) | (buf[p + 1] ^ b1) | (buf[p + 2] ^ b2)) === 0;
    case 4:
      return (buf, p) =>
        ((buf[p] ^ b0) |
          (buf[p + 1] ^ b1) |
          (buf[p + 2] ^ b2) |
          (buf[p + 3] ^ b3)) ===
        0;
    case 8:
      return (buf, p) =>
        ((buf[p] ^ b0) |
          (buf[p + 1] ^ b1) |
          (buf[p + 2] ^ b2) |
          (buf[p + 3] ^ b3) |
          (buf[p + 4] ^ b4) |
          (buf[p + 5] ^ b5) |
          (buf[p + 6] ^ b6) |
          (buf[p + 7] ^ b7)) ===
        0;
    default:
      return (buf, p) => {
        if (p + n > buf.length) return false;
        for (let i = 0; i < n; i++) if (buf[p + i] !== needle[i]) return false;
        return true;
      };
  }
};

const seg = 'grault';
const global_pos = 28;
const N = 50_000_000;

const segBuf = Buffer.from(seg, 'utf-8');
const eqBuf = compileBytes(segBuf);
const eqBufXor = compileBytesXor(segBuf);
const buffPaths = paths.map((p) => Buffer.from(p, 'utf-8'));
const simdF = simdCompile(seg);

let hits = 0;

const t0 = process.hrtime.bigint();
for (let i = 0; i < N; i++) {
  const s = paths[i & 1023];
  const pos = i & 1 ? global_pos : 46; // sometimes match, sometimes not
  if (s.indexOf(seg, pos) === pos) hits++;
}
const t1 = process.hrtime.bigint();

for (let i = 0; i < N; i++) {
  const s = paths[i & 1023];
  const pos = i & 1 ? global_pos : 46;
  if (s.startsWith(seg, pos)) hits++;
}
const t2 = process.hrtime.bigint();

for (let i = 0; i < N; i++) {
  const s = paths[i & 1023];
  const pos = i & 1 ? global_pos : 46;
  if (charCodeIndex(s, seg, pos)) hits++;
}
const t3 = process.hrtime.bigint();

for (let i = 0; i < N; i++) {
  const s = paths[i & 1023];
  const pos = i & 1 ? global_pos : 46;
  if (simdF(s, pos)) hits++;
}
const t4 = process.hrtime.bigint();

for (let i = 0; i < N; i++) {
  const s = buffPaths[i & 1023];
  const pos = i & 1 ? global_pos : 46;
  if (eqBuf(s, pos)) hits++;
}
const t5 = process.hrtime.bigint();

for (let i = 0; i < N; i++) {
  const s = buffPaths[i & 1023];
  const pos = i & 1 ? global_pos : 46;
  if (eqBufXor(s, pos)) hits++;
}
const t6 = process.hrtime.bigint();

for (let i = 0; i < N; i++) {
  const s = paths[i & 1023];
  const pos = i & 1 ? global_pos : 46;
  if (s.includes(seg, pos)) hits++;
}
const t7 = process.hrtime.bigint();

console.log('hits:', hits);
console.log('indexOf==pos ns/op:', Number(t1 - t0) / N);
console.log('startsWith  ns/op:', Number(t2 - t1) / N);
console.log('charCodeIndex  ns/op:', Number(t3 - t2) / N);
console.log('SIMD-Func  ns/op:', Number(t4 - t3) / N);
console.log('Buffer compile ns/op:', Number(t5 - t4) / N);
console.log('Buffer compile XOR ns/op:', Number(t6 - t5) / N);
console.log('includes ns/op:', Number(t7 - t6) / N);

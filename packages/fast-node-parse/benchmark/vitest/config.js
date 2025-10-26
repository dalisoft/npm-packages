/**
 * DO NOT TOUCH
 * THIS IS TESTING CONSTANT
 */
/** @type {import('vitest').BenchOptions} */
export const config = {
  iterations: 1_000_000,
  warmupIterations: 1_000,
  now: process.now
};

export const handler = () => {
  return 1 + (1 * 2) / 2 + 1;
};

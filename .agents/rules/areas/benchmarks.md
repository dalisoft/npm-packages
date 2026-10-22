---
paths:
  - "**/*.bench.{ts,tsx,js}"
  - "**/bench/**"
  - "**/BENCHMARK.md"
---

# Benchmarks

- Never claim code is fast without measuring. Benchmark performance-critical paths before and after a change.
- Use `vitest bench` for JS and TS benchmarks; keep benchmark files next to the code they measure or in `bench/`.
- Report results in `BENCHMARK.md` right after a run: date, machine, runtime version, and before/after numbers.
- Use runtime feature detection (for example SIMD) instead of assuming hardware support.

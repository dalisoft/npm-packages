# Benchmark Results

Last updated: 2025-08-18

## Performance Comparison

### Comparison with fast-path-parse (baseline)

| Route Type                             | fast-path-parse | RadixNode   | RadixOptimized | DFARouter         |
| -------------------------------------- | --------------- | ----------- | -------------- | ----------------- |
| Single Param `/users/:id`              | **28.6M**       | 8.1M (-72%) | 8.6M (-70%)    | 5.4M (-81%)       |
| Multi Param `/posts/:id/comments/:cid` | **15.3M**       | 3.7M (-76%) | 4.0M (-74%)    | 3.6M (-76%)       |
| Wildcard `/api/v1/*`                   | **18.1M**       | 3.1M (-83%) | 6.0M (-67%)    | 3.8M (-79%)       |
| Static `/static/css/main.css`          | 144.6M          | 4.7M (-97%) | 5.5M (-96%)    | **178.4M** (+23%) |

### Route Matching Performance (ops/sec)

| Route Type         | Radix Trie | DFA Router | path-to-regexp | find-my-way |
| ------------------ | ---------- | ---------- | -------------- | ----------- |
| **Static Routes**  | 12.8M      | **25.7M**  | 10.9M          | 17.0M       |
| **Single Param**   | **9.0M**   | 4.4M       | 2.0M           | 8.4M        |
| **Wildcard**       | **11.4M**  | 2.6M       | 2.0M           | 8.0M        |
| **Multi Param**    | **5.5M**   | 2.8M       | 2.7M           | 5.2M        |
| **Complex Routes** | 3.1M       | 1.6M       | 2.2M           | **3.2M**    |

### Key Findings

1. **DFA Router** excels at static routes (25.7M ops/sec) - 2x faster than Radix Trie
2. **Radix Trie** performs best for parameter-based routes (9.0M ops/sec for single param)
3. **Wildcard performance**: Radix Trie (11.4M) significantly outperforms DFA (2.6M)
4. Both implementations outperform `path-to-regexp` in most scenarios

### Optimization Notes

- DFA router optimization provides minimal gains (~1-2%)
- Radix compiled version shows no significant improvement over base implementation
- Static route caching in DFA provides O(1) lookup for repeated paths

## Recommendations

- Use **DFA Router** for applications with mostly static routes
- Use **Radix Trie** for applications with many dynamic parameters or wildcards
- Consider hybrid approach for mixed workloads

## Optimization Results

### RadixNode Optimizations Applied

- Separated static/dynamic children for faster lookups
- Character code comparisons instead of string comparisons
- First character caching for quick rejection
- Result: **18.3% performance improvement** (4.73M → 5.59M ops/sec)

## Next Steps

- [x] Optimize string matching with charCodeAt
- [ ] Implement SIMD optimizations for string matching
- [ ] Add route priority handling
- [ ] Implement route compilation caching
- [ ] Add memory usage benchmarks

# fast-node-parse Benchmark Report

## Performance Comparison: Current vs Expected

### Overview

The current implementation supports multiple children and subtrees (e.g., `/foo/bar` and `/foo/baz`), which differs from the original single-path implementation. This architectural change has significantly impacted performance.

## Static Routes (/foo)

### Node.js Runtime

| Operation | Current Performance | Expected Performance | Gap    | Status          |
| --------- | ------------------- | -------------------- | ------ | --------------- |
| Match     | 109.5M ops/s        | 111.5M ops/s         | -1.8%  | ✅ Near target  |
| Parse     | 106.6M ops/s        | 151M ops/s           | -29.4% | ❌ Below target |
| Lookup    | 107.1M ops/s        | 151M ops/s           | -29.1% | ❌ Below target |

### Bun Runtime

| Operation | Expected Performance | Status            |
| --------- | -------------------- | ----------------- |
| Match     | 376.5M ops/s         | ⏳ Not tested yet |
| Parse     | 376.5M ops/s         | ⏳ Not tested yet |
| Lookup    | 376.5M ops/s         | ⏳ Not tested yet |

## Dynamic Routes with 3-level Parameters (/foo/:id/:kind)

### Node.js Runtime

| Operation | Current Performance | Expected Performance | Gap    | Status                 |
| --------- | ------------------- | -------------------- | ------ | ---------------------- |
| Match     | 21.6M ops/s         | 49M ops/s            | -55.9% | ❌ Significantly below |
| Parse     | 10.3M ops/s         | 49M ops/s            | -79.0% | ❌ Significantly below |
| Lookup    | 4.3M ops/s          | 49M ops/s            | -91.2% | ❌ Critically below    |

### Bun Runtime

| Operation | Expected Performance | Status            |
| --------- | -------------------- | ----------------- |
| Match     | 60.5M ops/s          | ⏳ Not tested yet |
| Parse     | 60.5M ops/s          | ⏳ Not tested yet |
| Lookup    | 60.5M ops/s          | ⏳ Not tested yet |

## Performance Analysis

### Key Differences from Original Implementation

#### Original (High Performance) Implementation

- Used simple linked list structure with `next` pointer
- Linear traversal with O(1) memory overhead
- Direct node-to-node navigation
- No support for multiple routes/branches

#### Current (Multi-route) Implementation

- Uses tree structure with `children` array
- Supports multiple children per node for route branching
- Complex cursor-based traversal with `cursorMove` method
- Higher memory overhead with cursor object and children arrays

### Performance Bottlenecks Identified

1. **Cursor Object Overhead**:
   - Creating cursor object with multiple properties for each operation
   - Multiple property accesses in hot path

2. **Complex Navigation Logic**:
   - `cursorMove` method has multiple conditional branches
   - Array access overhead for children navigation
   - Additional checks for `children_length` and `child_index`

3. **Memory Access Patterns**:
   - Less cache-friendly due to array-based children storage
   - More pointer chasing through cursor properties

4. **Dynamic Route Performance**:
   - Suffers most from the architectural changes
   - Multiple parameter extractions compound the overhead
   - 79-91% performance degradation is critical

## Competitor Comparison (Node.js)

### Static Routes

- **fast-node-parse**: 109.5M ops/s (match)
- **find-my-way**: 17.5M ops/s
- **hono-regexp**: 59.8M ops/s
- **hono-trie**: 3.5M ops/s

### Dynamic Routes (3-level)

- **fast-node-parse**: 21.6M ops/s (match)
- **find-my-way**: 6.8M ops/s
- **hono-regexp**: 14.9M ops/s
- **hono-trie**: 1.9M ops/s

## Recommendations

### Critical Issues

1. **Dynamic route performance** is severely degraded (55-91% below target)
2. **Parse and lookup operations** for static routes are ~30% below target
3. The multi-route support has come at a significant performance cost

### Potential Optimizations

1. **Optimize cursorMove**:
   - Inline the method to reduce function call overhead
   - Simplify the branching logic
   - Consider using a stack-based approach instead of cursor object

2. **Reduce Object Allocations**:
   - Pre-allocate cursor objects and reuse them
   - Use primitive values instead of objects where possible

3. **Alternative Architectures**:
   - Consider separate implementations for single-path vs multi-path scenarios
   - Use specialized data structures for common cases
   - Implement fast path for routes without parameters

4. **Memory Layout Optimization**:
   - Use typed arrays for better memory locality
   - Flatten the tree structure where possible
   - Reduce pointer chasing

## Previous Optimization History

### Performance Optimization Summary

Fixed critical performance regression in the Node.js tree traversal implementation by:

1. **Fixed bug on line 21**: Changed incorrect comparison `children > 1` to `children_length > 0`
2. **Optimized object allocations**: Modified `cursorMove` to mutate existing cursor object instead of creating new objects on each iteration
3. **Reduced GC pressure**: Eliminated unnecessary object allocations in hot paths

### Previous Benchmark Results

#### Static Route Performance (`/foo`)

| Operation  | Before (ops/s) | After (ops/s) | Improvement |
| ---------- | -------------- | ------------- | ----------- |
| **match**  | 320,853,026    | 337,533,536   | **+5.2%**   |
| **parse**  | 182,247,538    | 163,163,245   | -10.5%      |
| **lookup** | Failed (bug)   | 141,893,497   | **Fixed**   |

#### Dynamic Route Performance (`/foo/:id`)

| Operation  | Before (ops/s) | After (ops/s) | Improvement |
| ---------- | -------------- | ------------- | ----------- |
| **match**  | 92,691,782     | 200,702,107   | **+116.5%** |
| **parse**  | 8,991,599      | 19,686,440    | **+119.0%** |
| **lookup** | 76,485,429     | 68,626,328    | -10.3%      |

## Next Steps

1. ⚠️ **Immediate**: Address critical performance gap in dynamic routes
2. 🔧 **Short-term**: Optimize parse/lookup operations for static routes
3. 🚀 **Long-term**: Consider architectural changes or dual implementations
4. 📊 **Testing**: Complete Bun runtime benchmarks for full comparison

## Conclusion

While the current implementation outperforms competitors, it falls significantly short of the expected performance levels, especially for dynamic routes. The multi-route support feature has introduced substantial overhead. The architecture needs fundamental optimization or a dual-implementation approach to meet the original performance targets while maintaining the multi-route functionality.

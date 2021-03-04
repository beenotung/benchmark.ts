# benchmark.ts

Measure the time needed to execute a given function.

[![npm Package Version](https://img.shields.io/npm/v/benchmark.ts.svg?maxAge=3600)](https://www.npmjs.com/package/benchmark.ts)

Similar to jsperf.com but doesn't need to be hosted.

### Remark
For async functions (e.g. with disk/network I/O), use `estimateAsync()`.

For sync functions, e.g. (CPU intensive calculations), use `estimateSync()`

## Example

*The cost of OOP*: [source](./test/fp-vs-oop.ts)

| Approach 	| Time to iterate 1m times | ops/second |
| :------: 	| ---------: 	| ------ 	|
| FP    	|  662.61 ms 	| 1510 k 	|
| OOP   	| 5604.00 ms 	|  180 k 	|

More examples:
- [FP vs OOP](./test/fp-vs-oop.ts)
- [callback vs promise](./test/callback-vs-promise.ts)
- [loop over collection](./test/loop-over-collections.ts)

## License
[BSD 2-Clause License](./BSD-2-Clause)

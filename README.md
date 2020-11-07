# benchmark.ts

Measure the time to execute the given function.

Similar to jsperf.com but doesn't need to be hosted.

## Example

*The cost of OOP*: [source](./test/fp-vs-oop.ts)

| Approach 	| Time to iterate 1m times | ops/second |
| :------: 	| ---------: 	| ------ 	|
| FP    	|  662.61 ms 	| 1510 k 	|
| OOP   	| 5604.00 ms 	|  180 k 	|

## License
[BSD 2-Clause License](./BSD-2-Clause)
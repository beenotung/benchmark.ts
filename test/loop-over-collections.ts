import { EstimateOptions, report } from '../utils'
import { estimateSync, MeasureFnSync } from '../sync'

let options: EstimateOptions = {
  nameFn: (fn) => (fn as any).name.replace('test', ''),
  maxErrorPercentage: 5,
  minSample: 1000,
}
let N = 1000
let array = new Array(N).fill(0).map((_, i) => i)
let set = new Set(array)
let map = new Map(array.map((x, i) => [i, x]))

function main() {
  test(testArrayForEach)
  test(testSetForEach)
  test(testMapForEach)
}

function testArrayForEach() {
  array.forEach(() => {
  })
}

function testSetForEach() {
  set.forEach(() => {
  })
}

function testMapForEach() {
  map.forEach(() => {
  })
}

function test(fn: MeasureFnSync) {
  let ms = estimateSync(fn, options)
  report(fn, ms)
}

main()

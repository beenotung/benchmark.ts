import { EstimateOptions, report } from '../utils'
import { estimateSync } from '../sync'

// config
let options: EstimateOptions = {
  nameFn: (fn) => fn.name.replace('test', ''),
  maxErrorPercentage: 5,
  minSample: 5,
}
let n = 77001 * 3
let xs = new Array(n).fill(0).map((_, i) => ({ id: i, name: 'i' + i }))

// test functions
function forOf() {
  for (let x of xs) {
    x.id + x.name
  }
}

function forEach() {
  xs.forEach((x) => x.id + x.name)
}

function forI() {
  for (let i = 0; i < xs.length; i++) {
    let x = xs[i]
    x.id + x.name
  }
}

// warm up
for (let i = 0; i < 5; i++) {
  forOf()
  forEach()
  forI()
}

// benchmark
let forOfMs = estimateSync(forOf, options)
report(forOf, forOfMs)

let forEachMs = estimateSync(forEach, options)
report(forOf, forOfMs)
report(forEach, forEachMs)

let forIMs = estimateSync(forI, options)
report(forOf, forOfMs)
report(forEach, forEachMs)
report(forI, forIMs)

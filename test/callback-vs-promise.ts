import { DoneFn, estimateAsync } from '../async'
import { estimate, report } from '../utils'

warmUp(1000, main)

async function main() {
  estimate.DefaultOptions.maxErrorPercentage = 1
  estimate.DefaultOptions.minSample = 1000
  estimate.DefaultOptions.nameFn = (fn) => fn.name.replace('test', '')

  await warmUpP(1000)
  let cbMs = await estimateAsync(testCallback)
  await warmUpP(1000)
  let thenMs = await estimateAsync(testThen)
  await warmUpP(1000)
  let awaitMs = await estimateAsync(testAwait)

  report(testCallback, cbMs)
  report(testThen, thenMs)
  report(testAwait, awaitMs)
}

function warmUp(n: number, done: DoneFn) {
  if (n <= 0) {
    done()
    return
  }
  setTimeout(warmUp, 0, n - 1, done)
}

function warmUpP(n: number) {
  return new Promise<void>((resolve) => warmUp(n, resolve))
}

function testCallback(done: DoneFn) {
  once(done)

  function once(done: DoneFn) {
    setTimeout(done)
  }
}

async function testThen(done: DoneFn) {
  once().then(done)

  function once() {
    return new Promise((resolve) => setTimeout(resolve))
  }
}

async function testAwait(done: DoneFn) {
  await once()
  done()

  function once() {
    return new Promise((resolve) => setTimeout(resolve))
  }
}

import { estimate, EstimateOptions } from './utils'

export type MeasureFnSync = () => void
export type EstimateContextSync = {
  name: string
  fn: MeasureFnSync
  ms: number
  batch: number
  maxErrorPercentage: number
}

export function estimateSync(
  fn: MeasureFnSync,
  _options: Partial<EstimateOptions> = {},
): number {
  let options = Object.assign({}, estimate.DefaultOptions, _options)
  let context: EstimateContextSync = {
    name: options.name || options.nameFn(fn),
    fn,
    ms: measureOnce(fn),
    batch: options.minSample,
    maxErrorPercentage: options.maxErrorPercentage,
  }
  return estimateIterate(context)
}

function estimateIterate(context: EstimateContextSync): number {
  for (;;) {
    let time = measureBatch(context.fn, context.batch)
    estimate.reportEstimateIterate(context)
    let diff = Math.abs(time - context.ms)
    let diff_percentage = (diff / context.ms) * 100
    if (diff_percentage <= context.maxErrorPercentage) {
      return context.ms
    }
    context.ms = (context.ms + time) / 2
    context.batch = context.batch * 1.5
  }
}

function measureOnce(fn: MeasureFnSync): number {
  let start = Date.now()
  fn()
  let end = Date.now()
  let diff = end - start
  return diff
}

function measureBatch(fn: MeasureFnSync, batch: number): number {
  let start = Date.now()
  for (let i = 0; i < batch; i++) {
    fn()
  }
  let end = Date.now()
  let used = end - start
  return used / batch
}

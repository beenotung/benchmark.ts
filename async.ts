import { estimate, EstimateOptions } from './utils'

export type MeasureFnAsync = (done: DoneFn) => void
export type DoneFn = () => void
export type CallbackFn<T> = (data: T) => void

export function estimateAsync(
  fn: MeasureFnAsync,
  options?: Partial<EstimateOptions>,
): Promise<number>
export function estimateAsync(
  fn: MeasureFnAsync,
  options: Partial<EstimateOptions>,
  done: CallbackFn<number>,
): void
export function estimateAsync(
  fn: MeasureFnAsync,
  done: CallbackFn<number>,
): void
export function estimateAsync(
  fn: MeasureFnAsync,
  optionsOrDone?: Partial<EstimateOptions> | CallbackFn<number>,
  done?: CallbackFn<number>,
): Promise<number> | void {
  let options: EstimateOptions
  if (typeof optionsOrDone === 'function') {
    options = estimate.DefaultOptions
    done = optionsOrDone
  } else if (optionsOrDone) {
    options = Object.assign({}, estimate.DefaultOptions, optionsOrDone)
  } else {
    options = estimate.DefaultOptions
  }

  if (!done) {
    return new Promise(resolve => estimateAsync(fn, options, resolve))
  }
  const callback = done
  measureOnce(fn, time => {
    let context: EstimateContextAsync = {
      name: options.name || options.nameFn(fn),
      fn,
      ms: time,
      batch: options.minSample,
      maxErrorPercentage: options.maxErrorPercentage,
    }
    estimateIterate(context, time => {
      callback(time)
    })
  })
}

export type EstimateContextAsync = {
  name: string
  fn: MeasureFnAsync
  ms: number
  batch: number
  maxErrorPercentage: number
}

function estimateIterate(
  context: EstimateContextAsync,
  done: CallbackFn<number>,
) {
  measureBatch(context.fn, context.batch, time => {
    estimate.reportEstimateIterate(context)
    let diff = Math.abs(time - context.ms)
    let diff_percentage = (diff / context.ms) * 100
    if (diff_percentage <= context.maxErrorPercentage) {
      done(context.ms)
      return
    }
    context.ms = (context.ms + time) / 2
    context.batch = context.batch * 1.5
    estimateIterate(context, done)
  })
}

function measureBatch(
  fn: MeasureFnAsync,
  batch: number,
  done: CallbackFn<number>,
) {
  measureBatchIterate(fn, batch, 0, 0, done)
}

function measureBatchIterate(
  fn: MeasureFnAsync,
  batch: number,
  current: number,
  acc: number,
  done: CallbackFn<number>,
) {
  if (current >= batch) {
    done(acc / batch)
    return
  }
  measureOnce(fn, time => {
    measureBatchIterate(fn, batch, current + 1, acc + time, done)
  })
}

function measureOnce(fn: MeasureFnAsync, done: CallbackFn<number>) {
  let start = Date.now()
  fn(() => {
    let end = Date.now()
    let diff = end - start
    done(diff)
  })
}

import { EstimateContextAsync, MeasureFnAsync } from './async'
import { EstimateContextSync } from './sync'

export type EstimateOptions = {
  name?: string
  nameFn: (fn: Function) => string
  maxErrorPercentage: number
  minSample: number
}

export namespace estimate {
  export let DefaultOptions: EstimateOptions = {
    nameFn: fn => fn.name,
    maxErrorPercentage: 1,
    minSample: 1,
  }

  export function reportEstimateIterate(
    context: EstimateContextSync | EstimateContextAsync,
  ) {
    let name = context.name
    let batch = context.batch.toFixed(1)
    let ms = context.ms.toFixed(2)
    console.log(`[progress] fn: ${name} \t batch: ${batch} \t ms: ${ms}`)
  }
}

export function report(fn: MeasureFnAsync | string, ms: number | string) {
  let name = typeof fn === 'string' ? fn : estimate.DefaultOptions.nameFn(fn)
  let tps = (1000 / +ms).toFixed(2)
  if (typeof ms === 'number') {
    ms = ms.toFixed(2)
  }
  console.log(`fn: ${name} \t| ms: ${ms} \t| TPS: ${tps}`)
}

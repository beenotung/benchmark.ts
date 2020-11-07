export type MeasureFn = (done: DoneFn) => void;
export type DoneFn = () => void;
export type CallbackFn<T> = (data: T) => void;

export type EstimateOptions = {
  name?: string;
  nameFn: (fn: MeasureFn) => string;
  maxErrorPercentage: number;
  minSample: number;
};

export function estimate(
  fn: MeasureFn,
  options?: Partial<EstimateOptions>,
): Promise<number>;
export function estimate(
  fn: MeasureFn,
  options: Partial<EstimateOptions>,
  done: CallbackFn<number>,
): void;
export function estimate(fn: MeasureFn, done: CallbackFn<number>): void;
export function estimate(
  fn: MeasureFn,
  optionsOrDone?: Partial<EstimateOptions> | CallbackFn<number>,
  done?: CallbackFn<number>,
): Promise<number> | void {
  let options: EstimateOptions;
  if (typeof optionsOrDone === 'function') {
    options = estimate.DefaultOptions;
    done = optionsOrDone;
  } else if (optionsOrDone) {
    options = Object.assign({}, estimate.DefaultOptions, optionsOrDone);
  } else {
    options = estimate.DefaultOptions;
  }

  if (!done) {
    return new Promise((resolve) => estimate(fn, options, resolve));
  }
  const callback = done;
  measureOnce(fn, (time) => {
    let context: EstimateContext = {
      name: options.name || options.nameFn(fn),
      fn,
      ms: time,
      batch: options.minSample,
      maxErrorPercentage: options.maxErrorPercentage,
    };
    estimateIterate(context, (time) => {
      callback(time);
    });
  });
}
export namespace estimate {
  export let DefaultOptions: EstimateOptions = {
    nameFn: (fn) => fn.name,
    maxErrorPercentage: 1,
    minSample: 1,
  };
  export function reportEstimateIterate(context: EstimateContext) {
    let name = context.name;
    let batch = context.batch.toFixed(1);
    let ms = context.ms.toFixed(2);
    console.log(`[progress] fn: ${name} \t batch: ${batch} \t ms: ${ms}`);
  }
}

export function report(fn: MeasureFn | string, ms: number | string) {
  let name = typeof fn === 'string' ? fn : estimate.DefaultOptions.nameFn(fn);
  let tps = (1000 / +ms).toFixed(2);
  if (typeof ms === 'number') {
    ms = ms.toFixed(2);
  }
  console.log(`fn: ${name} \t| ms: ${ms} \t| TPS: ${tps}`);
}

type EstimateContext = {
  name: string;
  fn: MeasureFn;
  ms: number;
  batch: number;
  maxErrorPercentage: number;
};

function estimateIterate(context: EstimateContext, done: CallbackFn<number>) {
  measureBatch(context.fn, context.batch, (time) => {
    estimate.reportEstimateIterate(context);
    let diff = Math.abs(time - context.ms);
    let diff_percentage = (diff / context.ms) * 100;
    if (diff_percentage <= context.maxErrorPercentage) {
      done(context.ms);
      return;
    }
    context.ms = (context.ms + time) / 2;
    context.batch = context.batch * 1.5;
    estimateIterate(context, done);
  });
}

function measureBatch(fn: MeasureFn, batch: number, done: CallbackFn<number>) {
  measureBatchIterate(fn, batch, 0, 0, done);
}

function measureBatchIterate(
  fn: MeasureFn,
  batch: number,
  current: number,
  acc: number,
  done: CallbackFn<number>,
) {
  if (current >= batch) {
    done(acc / batch);
    return;
  }
  measureOnce(fn, (time) => {
    measureBatchIterate(fn, batch, current + 1, acc + time, done);
  });
}

function measureOnce(fn: MeasureFn, done: CallbackFn<number>) {
  let start = Date.now();
  fn(() => {
    let end = Date.now();
    let diff = end - start;
    done(diff);
  });
}

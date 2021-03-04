import { DoneFn, estimate, EstimateOptions, report } from '..';

// config
let options: EstimateOptions = {
  nameFn: (fn) => fn.name.replace('test', ''),
  maxErrorPercentage: 5,
  minSample: 5,
};
let n = 77001 * 3;
let xs = new Array(n).fill(0).map((_, i) => ({ id: i, name: 'i' + i }));

// test functions
function forOf(done: DoneFn) {
  for (let x of xs) {
    x.id + x.name;
  }
  done();
}
function forEach(done: DoneFn) {
  xs.forEach((x) => x.id + x.name);
  done();
}
function forI(done: DoneFn) {
  for (let i = 0; i < xs.length; i++) {
    let x = xs[i];
    x.id + x.name;
  }
  done();
}

// warm up
for (let i = 0; i < 5; i++) {
  forOf(console.log);
  forEach(console.log);
  forI(console.log);
}

// benchmark
estimate(forOf, options, (forOfMs) => {
  report(forOf, forOfMs);
  estimate(forEach, options, (forEachMs) => {
    report(forOf, forOfMs);
    report(forEach, forEachMs);
    estimate(forI, options, (forIMs) => {
      report(forOf, forOfMs);
      report(forEach, forEachMs);
      report(forI, forIMs);
    });
  });
});

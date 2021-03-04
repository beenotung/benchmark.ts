import { EstimateOptions, report } from '../utils'
import { estimateSync } from '../sync'

let k = 1000
let m = k * k

let N_Actor = 1 * m

let options: EstimateOptions = {
  nameFn: (fn) => fn.name.replace('test', ''),
  maxErrorPercentage: 5,
  minSample: 1,
}

let fnMs = estimateSync(testFP, options)
report('FP', fnMs)

let oopMs = estimateSync(testOOP, options)
report('OOP', oopMs)
report('FP', fnMs)

function testFP() {
  type Actor = {
    run: () => void;
  };
  let actors: Actor[] = []
  let manager: Actor = {
    run: () => {
      for (let actor of actors) {
        actor.run()
      }
    },
  }
  for (let i = 0; i < N_Actor; i++) {
    spawn()
  }
  manager.run()

  function spawn() {
    let actor: Actor = {
      run: () => {
        let r = Math.floor(Math.random() * 256).toString(16)
        let g = Math.floor(Math.random() * 256).toString(16)
        let b = Math.floor(Math.random() * 256).toString(16)
        let color = '#' + r + g + b
        color.toString()
      },
    }
    actors.push(actor)
  }
}

function testOOP() {
  abstract class Actor {
    abstract run(): void;
  }

  class Manager extends Actor {
    actors: Actor[] = []

    spawn() {
      let actor = new (class extends Actor {
        run() {
          let r = Math.floor(Math.random() * 256).toString(16)
          let g = Math.floor(Math.random() * 256).toString(16)
          let b = Math.floor(Math.random() * 256).toString(16)
          let color = '#' + r + g + b
          color.toString()
        }
      })()
      this.actors.push(actor)
    }

    run() {
      for (let actor of this.actors) {
        actor.run()
      }
    }
  }

  let manager = new Manager()
  for (let i = 0; i < N_Actor; i++) {
    manager.spawn()
  }
  manager.run()
}

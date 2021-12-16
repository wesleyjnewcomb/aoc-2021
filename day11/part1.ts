import { read } from "../helpers";

class Cavern {
  private _octopi: Octopus[];
  private _step: number;
  private _flashes: number;
  private _width: number;
  private _synchronized: boolean;

  constructor(input: string) {
    this._octopi = [];
    this._step = 0;
    this._flashes = 0;
    this._synchronized = false;

    let width = this._width = 0;
    let i = 0;
    for (const c of input) {
      if (c == '\n') {
        this._width ||= i;
        width ||= i;
        continue;
      }
      const octopus = new Octopus(this, +c);
      let neighbor: Octopus;
      if (width) {
        // top
        neighbor = this._octopi[i - width];
        octopus.addNeighbor(neighbor);
        neighbor.addNeighbor(octopus);
        // top-right
        if (i % width < width - 1) {
          neighbor = this._octopi[i - width + 1];
          octopus.addNeighbor(neighbor);
          neighbor.addNeighbor(octopus);
        }
        if (i % width > 0) {
          // top-left
          neighbor = this._octopi[i - width - 1];
          octopus.addNeighbor(neighbor);
          neighbor.addNeighbor(octopus);

          // left
          neighbor = this._octopi[i - 1];
          octopus.addNeighbor(neighbor);
          neighbor.addNeighbor(octopus);
        }
      } else {
        if (i > 0) {
          neighbor = this._octopi[i - 1];
          octopus.addNeighbor(neighbor);
          neighbor.addNeighbor(octopus);
        }
      }
      this._octopi.push(octopus);
      i++;
    }
  }

  turn() {
    this._step++;
    const flashesBefore = this._flashes;
    for (const octopus of this._octopi) {
      octopus.increment(this._step);
    }
    if (this.flashes - flashesBefore === this._octopi.length) {
      this._synchronized = true;
    }
  }

  toString() {
    let str = ""
    for (let i = 0; i < this._octopi.length; i++) {
      if (i > 0 && i % this._width === 0) {
        str += '\n'
      }
      str += this._octopi[i].energy;
    }
    return str;
  }

  incrementFlashes() { this._flashes++; }
  get step() { return this._step; }
  get flashes() { return this._flashes; }
  get syncrhonized() { return this._synchronized; }
}

class Octopus {
  private _cavern: Cavern;
  private _energy: number;
  private _lastFlash: number;
  private _neighbors: Octopus[];

  constructor(cavern: Cavern, energy: number) {
    this._neighbors = [];
    this._cavern = cavern;
    this._energy = energy;
    this._lastFlash = 0;
  }

  addNeighbor(neighbor: Octopus) {
    this._neighbors.push(neighbor);
  }

  increment(turn: number) {
    if (this._energy >= 9) {
      this.flash(turn)
    } else if (this._lastFlash < turn) {
      this._energy++;
    }
  }

  flash(turn: number) {
    this._lastFlash = turn;
    this._energy = 0;
    this._cavern.incrementFlashes();
    for (const neighbor of this._neighbors) {
      neighbor.increment(turn);
    }
  }

  get energy() { return this._energy; }
}

console.time("solution")
read("input.txt").then(input => {
  const cavern = new Cavern(input);
  // while (!cavern.syncrhonized) {
  for (let i = 0; i < 100; i++) {
    cavern.turn();
  }
  console.timeEnd("solution")
  console.log(cavern.flashes)
  console.log(cavern.step)
})
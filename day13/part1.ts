import { readLines } from "../helpers"

interface Coord {
  x: number;
  y: number;
}

class Paper {
  private _dotsByX: Coord[][];
  private _dotsByY: Coord[][];

  constructor() {
    this._dotsByX = [];
    this._dotsByY = [];
  }

  addDot(dot: Coord): void {
    this.addX(dot);
    this.addY(dot);
  }

  foldX(x: number) {
    for (let i = x + 1; i < this._dotsByX.length; i++) {
      if (!this._dotsByX[i]) continue;

      for (const coord of this._dotsByX[i]) {
        const newX = 2 * x - coord.x;
        coord.x = newX;
        this.addX(coord);
      }
    }
    this._dotsByX = this._dotsByX.slice(0, x);
  }

  foldY(y: number) {
    for (let i = y + 1; i < this._dotsByY.length; i++) {
      if (!this._dotsByY[i]) continue;

      for (const coord of this._dotsByY[i]) {
        const newY = 2 * y - coord.y;
        coord.y = newY;
        this.addY(coord);
      }
    }
    this._dotsByY = this._dotsByY.slice(0, y);
  }

  dotsByCoord() {
    const dotsByCoord: Record<string, Coord> = {};
    for (const x in this._dotsByX) {
      for (const coord of this._dotsByX[x]) {
        dotsByCoord[`${coord.x},${coord.y}`] = coord;
      }
    }
    return dotsByCoord;
  }

  toString() {
    let str = ""
    const dotsByCoord = this.dotsByCoord();
    for (let y = 0; y < this._dotsByY.length; y++) {
      for (let x = 0; x < this._dotsByX.length; x++) {
        if (dotsByCoord[`${x},${y}`]) {
          str += '#';
        } else {
          str += '.';
        }
      }
      str += '\n';
    }
    return str;
  }

  private addX(dot: Coord) {
    if (!this._dotsByX[dot.x]) {
      this._dotsByX[dot.x] = []
    }
    this._dotsByX[dot.x].push(dot);
  }

  private addY(dot: Coord) {
    if (!this._dotsByY[dot.y]) {
      this._dotsByY[dot.y] = []
    }
    this._dotsByY[dot.y].push(dot);
  }
}

readLines("input.txt").then(lines => {
  const paper = new Paper();
  let i = 0;
  // add dots
  console.time("add dots")
  while (lines[i] != '') {
    const [x, y] = lines[i].split(',').map(n => +n)
    paper.addDot({ x, y });
    i++;
  }
  console.timeEnd("add dots")
  i++; // skip blank line
  // process instructions
  console.time("process instructions")
  while (i < lines.length) {
    const [fold, n] = lines[i].split('=');
    if (fold[fold.length - 1] === "x") {
      paper.foldX(+n);
    }
    if (fold[fold.length - 1] === "y") {
      paper.foldY(+n);
    }
    i++;
  }
  console.timeEnd("process instructions")
  console.log(paper.toString());
})
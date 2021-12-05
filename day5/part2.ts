import { readLines } from "../helpers";

class Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
  isHorizontal() {
    return this.x1 === this.x2 && this.y1 !== this.y2;
  }
  isVertical() {
    return this.x1 !== this.x2 && this.y1 === this.y2;
  }
  isOrthoganal() {
    return this.isHorizontal() || this.isVertical();
  }
  coordinates(): { x: number, y: number }[] {
    const coordinates = [];
    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;

    if (Math.abs(dx) >= Math.abs(dy)) {
      for (let i = 0; i <= Math.abs(dx); i++) {
        const step = i * Math.sign(dx);
        const x = this.x1 + step;
        const y = this.y1 + Math.floor(step * dy / dx);
        coordinates.push({ x, y })
      }
    } else {
      for (let i = 0; i <= Math.abs(dy); i++) {
        const step = i * Math.sign(dy);
        const x = this.x1 + Math.floor(step * dx / dy);
        const y = this.y1 + step;
        coordinates.push({ x, y })
      }
    }
    return coordinates;
  }
}

function createLine(str: string): Line {
  const [firstCoord, secondCoord] = str.split(" -> ");
  const [x1, y1] = firstCoord.split(",");
  const [x2, y2] = secondCoord.split(",")
  return new Line(
    parseInt(x1),
    parseInt(y1),
    parseInt(x2),
    parseInt(y2)
  );
}

class Grid {
  private _grid: number[][];
  private _intersections: number;

  constructor(height: number, width: number) {
    this._intersections = 0;
    this._grid = new Array(height);
    for (let row = 0; row < height; row++) {
      this._grid[row] = new Array(width);
    }
  }

  addLine(line: Line): void {
    for (const { x, y } of line.coordinates()) {
      this._grid[y][x] ||= 0;
      this._grid[y][x]++;
      if (this._grid[y][x] === 2) {
        this._intersections++;
      }
    }
  }

  get intersections() { return this._intersections; }
}

console.time("solution")
readLines("input.txt").then(lineStrings => {
  const grid = new Grid(1000, 1000);
  for (const str of lineStrings) {
    const line = createLine(str);
    grid.addLine(line);
  }
  console.timeEnd("solution")
  console.log(grid.intersections);
})
import { read } from "../helpers";

class Coords {
  private _row: number;
  private _column: number;
  static _coords: Record<string, Coords> = {};

  private constructor(row: number, column: number) {
    this._row = row;
    this._column = column;
  }

  static get(row: number, column: number): Coords {
    return this._coords[`${row},${column}`] ||= new Coords(row, column);
  }

  toString() { return `${this.row},${this.column}` }

  neighbors(height?: number, width?: number) {
    const result: Coords[] = []
    const { row, column } = this;

    if (row > 0) result.push(Coords.get(row - 1, column));
    if (height && row < (height - 1)) result.push(Coords.get(row + 1, column));
    if (column > 0) result.push(Coords.get(row, column - 1));
    if (width && column < (width - 1)) result.push(Coords.get(row, column + 1));
    return result;
  }

  get row() { return this._row; }
  get column() { return this._column; }
}

class HeightMap {
  private _heights: number[][];
  private _height: number;
  private _width;
  private _lowPointMemo: Record<string, Coords>;
  private _lowPoints: Set<Coords>;
  private _basins: Record<string, Coords[]>;
  constructor(heights: string) {
    this._heights = heights.split('\n').map(row => row.split('').map(n => +n));
    this._width = heights.indexOf('\n');
    this._height = (heights.length + 1) / (this._width + 1);
    this._lowPointMemo = {};
    this._lowPoints = new Set();
    this._basins = {};
  }
  get height() { return this._height; }
  get width() { return this._width; }
  get lowPoints() { return this._lowPoints; }
  get basins() { return this._basins; }

  getCell({ row, column }: Coords) {
    return this._heights[row][column];
  }

  findLowPoint(coords: Coords): Coords {
    if (this._lowPointMemo[coords.toString()]) return this._lowPointMemo[coords.toString()];

    let lowestCoords = coords;
    let lowestHeight = this.getCell(coords);

    for (const neighbor of coords.neighbors(this._height, this._width)) {
      const neighborHeight = this.getCell(neighbor);
      if (neighborHeight <= lowestHeight) {
        lowestCoords = neighbor;
        lowestHeight = neighborHeight;
      }
    }
    if (lowestCoords === coords) {
      this._lowPointMemo[coords.toString()] = coords;
      this._lowPoints.add(coords);
      this._basins[coords.toString()] = [coords]
      return coords;
    } else {
      const finalPoint = this.findLowPoint(lowestCoords);
      this._lowPointMemo[coords.toString()] = finalPoint
      if (this.getCell(coords) < 9) {
        this._basins[finalPoint.toString()].push(coords);
      }
      return this._lowPointMemo[coords.toString()]
    }
  }
}

console.time("solution")
read("input.txt").then(input => {
  const heightMap = new HeightMap(input);
  for (let row = 0; row < heightMap.height; row++) {
    for (let column = 0; column < heightMap.width; column++) {
      heightMap.findLowPoint(Coords.get(row, column));
    }
  }
  let sum = 0;
  for (const coords of heightMap.lowPoints) {
    sum += heightMap.getCell(coords) + 1;
  }
  console.timeEnd("solution")
  console.log(sum);
  const basinSizes: number[] = [];
  for (const lowPoint in heightMap.basins) {
    basinSizes.push(heightMap.basins[lowPoint].length);
  }
  basinSizes.sort((a, b) => b - a)
  console.log(basinSizes[0] * basinSizes[1] * basinSizes[2])
})
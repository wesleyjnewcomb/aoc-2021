import { read } from "../helpers";

interface Cell {
  i: number;
  j: number;
  distance: number;
}

function neighbors(i: number, j: number): Array<[i: number, j: number]> {
  return [
    [i - 1, j],
    [i, j - 1],
    [i + 1, j],
    [i, j + 1],
  ]
}

function inBounds(i: number, j: number, rows: number, columns: number): boolean {
  return i >= 0 && i < rows && j >= 0 && j < columns;
}

function par(i: number): number {
  return (i - 1) >> 1;
}

function left(i: number): number {
  return i << 1 + 1;
}

function right(i: number): number {
  return i << 1 + 2;
}

type Comparator<T> = (a: T, b: T) => number;

class Heap<T> {
  private _arr: T[];
  private _comp: Comparator<T>;

  constructor(comparator: Comparator<T>) {
    this._arr = [];
    this._comp = comparator;
  }

  push(value: T) {
    this._arr.push(value);
    for (
      let i = this._arr.length - 1;
      i !== 0 && this.compare(i, par(i)) > 0;
      i = par(i)
    ) {
      this.swap(i, par(i));
    }
  }

  pop(): T | undefined {
    const min = this._arr.shift();
    this.heapify(0);
    return min;
  }

  get size(): number {
    return this._arr.length;
  }

  private compare(i: number, j: number): number {
    return this._comp(this._arr[i], this._arr[j]);
  }

  private swap(i: number, j: number): void {
    const buff = this._arr[i];
    this._arr[i] = this._arr[j];
    this._arr[j] = buff;
  }

  private heapify(i: number): void {
    const l = left(i);
    const r = right(i);
    let smallest = i;
    if (l < this._arr.length && this.compare(l, i) < 0) {
      smallest = l;
    }
    if (r < this._arr.length && this.compare(r, i) < 0) {
      smallest = r;
    }
    if (smallest != i) {
      this.swap(i, smallest);
      this.heapify(smallest);
    }
  }
}

function parseGrid(input: string): number[][] {
  const grid: number[][] = [];
  let row: number[] = [];
  for (const c of input) {
    if (c === '\n') {
      grid.push(row);
      row = [];
    } else {
      row.push(+c)
    }
  }
  grid.push(row);
  return grid;
}

function getRisk(grid: number[][], i: number, j: number): number {
  const rows = grid.length;
  const cols = grid[0].length;
  const risk = grid[i % rows][j % cols];
  const increment = Math.floor(i / rows) + Math.floor(j / cols);
  return (risk + increment - 1) % 9 + 1;
}

function shortestPath(grid: number[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  const dist: number[][] = Array.from(new Array(rows * 5), () => new Array(cols * 5).fill(Infinity))
  const queue = new Heap<Cell>((a, b) => b.distance - a.distance);
  dist[0][0] = 0;
  queue.push({ i: 0, j: 0, distance: dist[0][0] });

  while (queue.size > 0) {
    const cell = queue.pop() as Cell;
    const { i, j } = cell;

    for (const [ii, jj] of neighbors(cell.i, cell.j)) {
      if (!inBounds(ii, jj, rows * 5, cols * 5)) {
        continue;
      }
      if (dist[ii][jj] > dist[i][j] + getRisk(grid, ii, jj)) {
        dist[ii][jj] = dist[i][j] + getRisk(grid, ii, jj);
        queue.push({ i: ii, j: jj, distance: dist[ii][jj] })
      }
    }
  }

  return dist[dist.length - 1][dist[0].length - 1];
}

console.time("solution")
read("input.txt").then(input => {
  const grid = parseGrid(input);
  const shortestDistance = shortestPath(grid)
  console.timeEnd("solution");
  console.log(shortestDistance);
})
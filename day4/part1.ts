import { read } from "../helpers";

type Coordinate = [row: number, column: number];

class BingoCard {
  private _winner: boolean;
  private _unmarkedNumbers: Map<string, Coordinate>;
  private _rowCounts: number[];
  private _columnCounts: number[];
  private _score: number;

  constructor(grid: string[][]) {
    this._winner = false;
    this._score = 0;
    this._unmarkedNumbers = new Map();
    this._rowCounts = [5,5,5,5,5];
    this._columnCounts = [5,5,5,5,5];
    for (let row = 0; row < grid.length; row++) {
      for (let column = 0; column < grid[row].length; column++) {
        const n = grid[row][column]
        this._unmarkedNumbers.set(n, [row, column]);
        this._score += parseInt(n);
      }
    }
  }

  mark(cmd: string): void {
    const n = parseInt(cmd)
    const coord = this._unmarkedNumbers.get(cmd);
    if (!coord) return;

    const [row, column] = coord;
    this._rowCounts[row]--;
    this._columnCounts[column]--;
    this._score -= n;
    if (this._rowCounts[row] === 0 || this._columnCounts[column] === 0) {
      this._winner = true;
    }
  }

  get score() { return this._score; }
  get winner() { return this._winner; }
}

function parseCard(cardStr: string): BingoCard {
  const data = cardStr.split('\n')
                      .map(rowStr => 
                        rowStr.split(' ').filter(x => !!x)
                      )
  return new BingoCard(data);
}

read("input.txt").then(data => {
  console.time("solution")
  const blocks = data.split('\n\n');
  const commands = blocks[0].split(',');
  const cardStrings = blocks.slice(1);
  const cards: BingoCard[] = []
  for (const cardStr of cardStrings) {
    cards.push(parseCard(cardStr));
  }

  let winner: BingoCard | null = null;
  let winningCommand;
  for (const command of commands) {
    for (const card of cards) {
      card.mark(command);
      if (card.winner) {
        winner = card;
        break
      }
    }
    winningCommand = command;
    if (winner) break;
  }
  if (winner && winningCommand) {
    console.log(winner.score, winningCommand, winner.score * parseInt(winningCommand))
  }
  console.timeEnd("solution")
})
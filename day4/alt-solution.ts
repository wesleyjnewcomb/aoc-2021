import { read } from "../helpers";

type Coordinate = [row: number, column: number];

class BingoCard {
  private _bingo: number;
  private _unmarkedNumbers: Map<string, Coordinate>;
  private _rowCounts: number[];
  private _columnCounts: number[];
  private _score: number;

  constructor(grid: string[][]) {
    this._bingo = 0;
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
      this._bingo++;
    }
  }

  get score() { return this._score; }
  get bingo() { return this._bingo; }
}

function parseCard(cardStr: string): BingoCard {
  const data = cardStr.split('\r\n')
                      .map(rowStr => 
                        rowStr.split(' ').filter(x => !!x)
                      )
  return new BingoCard(data);
}

function findLastWinner(cards: BingoCard[], commands: string[]): [winner: BingoCard | null, command: string | null] {
  for (let commandIndex = commands.length - 1; commandIndex >= 0; commandIndex--) {
    const command = commands[commandIndex];
    for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
      const card = cards[cardIndex];
      card.mark(command);
      if (card.bingo > 0) {
        // double-check for previous bingos
        for (let i = commandIndex - 1; i >= 0; i--) {
          card.mark(commands[i]);
          if (card.bingo > 1) {
            cards.splice(cardIndex, 1);
            cardIndex--;
            break;
          }
        }
        if (card.bingo === 1) {
          return [card, command]
        }
      }
    }
  }
  return [null, null]
}

read("input.txt").then(data => {
  const blocks = data.split('\r\n\r\n');
  const commands = blocks[0].split(',');
  const cardStrings = blocks.slice(1);
  const cards: BingoCard[] = []
  for (const cardStr of cardStrings) {
    cards.push(parseCard(cardStr));
  }
  const [winner, winningCommand] = findLastWinner(cards, commands);
  
  if (winner && winningCommand) {
    console.log(winner.score, winningCommand, winner.score * parseInt(winningCommand))
  }
})
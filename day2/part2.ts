import { readLines } from "../helpers";

interface Position {
  x: number;
  depth: number;
  aim: number;
}

readLines("./input.txt").then(directions => 
  directions.reduce((position, direction): Position  => {
    const a = direction.split(" ")
    const command = a[0];
    const n = +a[1];
    switch (command) {
      case "forward":
        position.x += n;
        position.depth += n * position.aim;
        break;
      case "up":
        position.aim -= n;
        break;
      case "down": 
        position.aim += n;
        break;
    }
    return position;
  }, { x: 0, depth: 0, aim: 0 })
).then((position: Position) => console.log(position.x * position.depth ));
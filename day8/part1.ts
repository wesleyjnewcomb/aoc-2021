import { readLines } from "../helpers"

readLines("input.txt").then(input => {
  let count = 0;
  for (const line of input) {
    const display = line.split(" | ")[1].split(" ")
    console.log(display)
    for (const digit of display) {
      switch (digit.length) {
        case 2: // 1
        case 3: // 7
        case 4: // 4
        case 7: // 8
          count++;
      }
    }
  }
  console.log(count);
})
import { read } from "../helpers";

const days = 256;
const memo: Record<string, number> = {};
function countFish(timer: number, daysRemaining: number) {
  if (timer >= daysRemaining) return 1;
  if (memo[`${timer},${daysRemaining}`]) return memo[`${timer},${daysRemaining}`];

  let sum = 1; // count self
  for (let day = daysRemaining - timer - 1; day >= 0; day -= 7) {
    sum += countFish(8, day);
  }
  memo[`${timer},${daysRemaining}`] = sum;
  return sum;
}

console.time("solution");
read("input.txt").then(input => {
  let fish = 0;
  for (const str of input.split(',')) {
    fish += countFish(parseInt(str), days);
  }
  console.timeEnd("solution");
  console.log(fish);
})
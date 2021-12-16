import { read } from "../helpers";

function processInput(initialFish: number[], days: number) {
  const fish: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const f of initialFish) {
    fish[f]++;
  }
  for (let day = 0; day < days; day++) {
    const baseIndex = day % 9;
    const respawningIndex = (baseIndex + 7) % 9;
    const spawningFish = fish[baseIndex];
    fish[respawningIndex] += spawningFish;
  }
  return fish.reduce((a, b) => a + b, 0)
}

console.time("solution");
read("input.txt").then(input => {
  const totalFish = processInput(input.split(',').map(n => +n), 256);
  console.timeEnd("solution");
  console.log(totalFish);
})
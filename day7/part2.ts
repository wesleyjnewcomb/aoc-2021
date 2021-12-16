import { read } from "../helpers";

const triangular = (n: number) => (n * n + n) >> 1;

console.time("solution");
read("input.txt").then(input => {
  const numbers = input.split(",").map(n => +n);
  const mean: number = Math.floor(numbers.reduce((prev, curr) => prev + curr, 0) / numbers.length);
  const result = numbers.reduce((prev, curr) => prev + triangular(Math.abs(curr - mean)), 0)
  console.timeEnd("solution");
  console.log(result)
})

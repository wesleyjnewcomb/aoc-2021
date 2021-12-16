import { read } from "../helpers";

console.time("solution");
read("input.txt").then(input => {
  const numbers = input.split(",").map(n => +n).sort((a, b) => a - b);
  const midpoint = Math.floor(numbers.length >> 1)
  let median: number;
  if (numbers.length % 2 === 0) {
    median = Math.floor((numbers[midpoint - 1] + numbers[midpoint]) >> 1);
  } else {
    median = numbers[midpoint];
  }
  const result = numbers.reduce((prev, curr) => prev + Math.abs(curr - median), 0)
  console.timeEnd("solution");
  console.log(result)
})
import * as fs from "fs/promises";

function processInput(fileData: string): number[] {
  return fileData.split('\n').map(n => Number(n));
}

function windowSums(ns: number[], windowSize = 3): number[] {
  const sums = []
  for (let i = 0; i < ns.length - windowSize + 1; i++) {
    let sum = 0;
    for (let j = 0; j < windowSize; j++) {
      sum += ns[i + j];
    }
    sums.push(sum);
  }
  return sums;
}

function countIncrements(ns: number[]) {
  let increments = 0;
  for (let i = 1; i < ns.length; i++) {
    if(ns[i] > ns[i - 1]) increments++;
  }
  return increments;
}

fs.readFile("input.txt").then(buffer => {
  const numbers = processInput(buffer.toString());
  const sums = windowSums(numbers);
  console.log(countIncrements(sums))
})
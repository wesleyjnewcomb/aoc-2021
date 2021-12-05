import * as fs from "fs/promises";
import { argv } from "process";

function processInput(fileData: string): number[] {
  return fileData.split('\n').map(n => Number(n));
}

function countIncrements(ns: number[]) {
  let increments = 0;
  for (let i = 1; i < ns.length; i++) {
    if(ns[i] > ns[i - 1]) increments++;
  }
  return increments;
}

fs.readFile("input.txt").then(buffer => {
  console.log(countIncrements(processInput(buffer.toString())))
})
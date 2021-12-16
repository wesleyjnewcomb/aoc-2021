import { readLines } from "../helpers"

const ALPHA_BITS: Record<string, number> = {
  a: 1,
  b: 1 << 1,
  c: 1 << 2,
  d: 1 << 3,
  e: 1 << 4,
  f: 1 << 5,
  g: 1 << 6
};

type ProcessedSignals = Map<number, number[]>
type Mapping = Record<number, number>

function strToBits(str: string): number {
  return str.split('').reduce((bits, char) => bits | ALPHA_BITS[char], 0);
}

function processSignals(signals: string) {
  return signals.split(" ").reduce((map: ProcessedSignals, curr) => {
    const n = strToBits(curr);
    const arr = map.get(curr.length);
    if (arr) {
      arr.push(n)
    } else {
      map.set(curr.length, [n]);
    }
    return map;
  }, new Map())
}

function determineMapping(processedSignals: ProcessedSignals): Mapping {
  let zero = 0;
  const one = (processedSignals.get(2) as number[])[0];
  let two = -2;
  let three = -3;
  const four = (processedSignals.get(4) as number[])[0];
  let five = -5;
  let six = -6;
  const seven = (processedSignals.get(3) as number[])[0];
  const eight = (processedSignals.get(7) as number[])[0];
  let nine = -9;

  // 0, 6, 9
  for (const bits of processedSignals.get(6) as number[]) {
    if ((bits & four) === four) {
      nine = bits;
    } else if ((bits & one) === one) {
      zero = bits;
    } else {
      six = bits;
    }
  }
  // 2, 3, 5
  for (const bits of processedSignals.get(5) as number[]) {
    if ((bits & one) === one) {
      three = bits;
    } else if ((bits & six) === bits) {
      five = bits;
    } else {
      two = bits;
    }
  }
  return {
    [zero]: 0,
    [one]: 1,
    [two]: 2,
    [three]: 3,
    [four]: 4,
    [five]: 5,
    [six]: 6,
    [seven]: 7,
    [eight]: 8,
    [nine]: 9
  }
}

console.time("solution")
readLines("input.txt").then(input => {
  let sum = 0;
  for (const line of input) {
    const [signals, output] = line.split(" | ")
    const processedSignals = processSignals(signals)
    const mapping = determineMapping(processedSignals)
    sum += +output.split(" ").map(s => mapping[strToBits(s)]).join("")
  }
  console.timeEnd("solution")
  console.log(sum);
})
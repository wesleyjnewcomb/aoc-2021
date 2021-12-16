import { readLines } from "../helpers"

type ElementCounts = Record<string, number>;
type ElementCountsMemo = { [pair: string]: { [daysRemaining: number]: ElementCounts } }
type Rules = Record<string, string>
const elementCountsMemo: ElementCountsMemo = {};

function addCounts(a: ElementCounts, b: ElementCounts): ElementCounts {
  const result = Object.assign({}, a);
  for (const element in b) {
    if (result[element]) {
      result[element] += b[element];
    } else {
      result[element] = b[element];
    }
  }
  return result;
}

function elementCounts(pair: string, stepsRemaining: number, rules: Rules): ElementCounts {
  if (stepsRemaining <= 0 || !rules[pair]) {
    return {};
  }
  if (elementCountsMemo[pair] && elementCountsMemo[pair][stepsRemaining]) {
    return elementCountsMemo[pair][stepsRemaining]
  }
  const resultElement: string = rules[pair];
  const leftResult: ElementCounts = elementCounts(`${pair[0]}${resultElement}`, stepsRemaining - 1, rules);
  const rightResult: ElementCounts = elementCounts(`${resultElement}${pair[1]}`, stepsRemaining - 1, rules);
  const childCounts = addCounts(leftResult, rightResult);
  const result = addCounts({ [resultElement]: 1 }, childCounts)
  if (!elementCountsMemo[pair]) {
    elementCountsMemo[pair] = {}
  }
  elementCountsMemo[pair][stepsRemaining] = result;
  return result;
}

function parseRules(lines: string[]): Rules {
  const rules: Rules = {};
  for (const line of lines) {
    const [pair, result] = line.split(' -> ');
    rules[pair] = result;
  }
  return rules;
}

console.time("solution")
readLines("input.txt").then(lines => {
  const polymer = lines[0];
  const rules = parseRules(lines.slice(2));
  let counts: ElementCounts = {}
  for (const c of polymer) {
    counts[c] ||= 0;
    counts[c]++;
  }
  for (let i = 0; i < polymer.length - 1; i++) {
    const pair = `${polymer[i]}${polymer[i + 1]}`
    counts = addCounts(counts, elementCounts(pair, 40, rules))
  }
  let highest = -Infinity
  let lowest = Infinity
  let sum = 0;
  for (const element in counts) {
    const n: number = counts[element];
    if (n > highest) highest = n;
    if (n < lowest) lowest = n;
    sum += n;
  }
  console.timeEnd("solution")
  // console.log(elementCountsMemo)
  console.log(highest - lowest);
  console.log(sum);
})
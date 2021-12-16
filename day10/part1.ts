import { readLines } from "../helpers";



const firstWrongBracket = (line: string): string | null => {
  const stack = []
  for (const c of line) {
    let top;
    switch (c) {
      case "(":
      case "[":
      case "{":
      case "<":
        stack.push(c);
        break;
      case ")":
        top = stack.pop();
        if (top !== "(") {
          return c;
        }
        break;
      case "]":
        top = stack.pop();
        if (top !== "[") {
          return c;
        }
        break;
      case "}":
        top = stack.pop();
        if (top !== "{") {
          return c;
        }
        break;
      case ">":
        top = stack.pop();
        if (top !== "<") {
          return c;
        }
        break;
    }
  }
  return null;
}

const missingBrackets = (line: string): string => {
  const stack = [];
  for (const c of line) {
    let top;
    switch (c) {
      case "(":
      case "[":
      case "{":
      case "<":
        stack.push(c);
        break;
      case ")":
        top = stack.pop();
        if (top !== "(") {
          throw new Error(`Wrong bracket found: ${line}`);
        }
        break;
      case "]":
        top = stack.pop();
        if (top !== "[") {
          throw new Error(`Wrong bracket found: ${line}`);
        }
        break;
      case "}":
        top = stack.pop();
        if (top !== "{") {
          throw new Error(`Wrong bracket found: ${line}`);
        }
        break;
      case ">":
        top = stack.pop();
        if (top !== "<") {
          throw new Error(`Wrong bracket found: ${line}`);
        }
        break;
    }
  }
  return stack.join('');
}

const solution = (lines: string[]): [number, number[]] => {
  let sum = 0;
  const sums = [];
  for (const line of lines) {
    const wrongBracket = firstWrongBracket(line);
    if (wrongBracket) {
      switch (wrongBracket) {
        case ")":
          sum += 3;
          break;
        case "]":
          sum += 57;
          break;
        case "}":
          sum += 1197;
          break;
        case ">":
          sum += 25137;
          break;
      }
    } else {
      const brackets = missingBrackets(line);
      let s = 0;
      for (let i = brackets.length - 1; i >= 0; i--) {
        s *= 5;
        const c = brackets[i];
        switch (c) {
          case "(":
            s += 1;
            break;
          case "[":
            s += 2;
            break;
          case "{":
            s += 3;
            break;
          case "<":
            s += 4;
            break;
        }
      }
      sums.push(s);
    }
  }
  return [sum, sums];
}

console.time("solution")
readLines("input.txt").then(lines => {
  const [solution1, solution2] = solution(lines);
  solution2.sort((a, b) => a - b);
  console.timeEnd("solution")
  console.log(solution2);
  console.log(solution1, solution2[solution.length >> 1]);
})
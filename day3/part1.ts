import { read } from "../helpers";


read("input.txt").then(rawInput => {
  const bitLength = rawInput.indexOf("\r");
  const rowLength = bitLength + 2
  const rowCount = rawInput.length / rowLength;
  const gammaBits = new Array(bitLength);
  for (let bitIndex = 0; bitIndex < bitLength; bitIndex++) {
    let zeroCount = 0;
    let oneCount = 0;
    for (let row = 0; row < rowCount; row++) {
      const charIndex = row * rowLength + bitIndex;
      if (rawInput[charIndex] == "1") {
        oneCount++;
        if (oneCount > zeroCount + rowCount - row - 1) {
          gammaBits[bitIndex] = "1"
          break;
        }
      } else if (rawInput[charIndex] == "0") {
        zeroCount++;
        if (zeroCount > oneCount + rowCount - row - 1) {
          gammaBits[bitIndex] = "0"
          break;
        }
      }
    }
    console.log("0s", zeroCount);
    console.log("1s", oneCount)
  }
  const gamma = parseInt(gammaBits.join(''), 2);
  const bitMask = (1 << bitLength) - 1
  const epsilon = gamma ^ bitMask;
  console.log(gamma * epsilon);
})
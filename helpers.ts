import * as fs from "fs/promises";

export const read = (filePath: string): Promise<string> => fs.readFile(filePath, "utf-8").then(buffer => buffer.toString())

export const readLines = (filePath: string): Promise<string[]> => 
  fs.readFile(filePath).then(buffer => buffer.toString()).then(str => str.split('\n'))

import { readLines } from "../helpers";

class Graph {
  private _nodes: Map<string, Set<string>>;
  private _paths: Set<string>[];

  constructor() {
    this._nodes = new Map<string, Set<string>>();
    this._paths = [];
  }

  addConnection(a: string, b: string) {
    if (!this._nodes.has(a)) {
      this._nodes.set(a, new Set<string>());
    }
    if (!this._nodes.has(b)) {
      this._nodes.set(b, new Set<string>());
    }
    (this._nodes.get(a) as Set<string>).add(b);
    (this._nodes.get(b) as Set<string>).add(a);
  }

  findPaths(position = "start", endNode = "end", previousNodes: Set<string> = new Set(), hasExtraVisit = true): void {
    if (!this._nodes.has(position)) throw new Error(`Invalid position: ${position}`);
    if (!this._nodes.has(endNode)) throw new Error(`Invalid end node: ${endNode}`);
    // console.log(previousNodes);
    if (position === "start" && previousNodes.size > 0) return;
    if (position === endNode) {
      this._paths.push(previousNodes.add(position));
      return
    }
    if (position === position.toLowerCase() && previousNodes.has(position)) {
      if (!hasExtraVisit) return;
      hasExtraVisit = false;
    }

    for (const nextNode of this._nodes.get(position) as Set<string>) {
      this.findPaths(nextNode, endNode, new Set(previousNodes).add(position), hasExtraVisit);
    }
  }

  get paths() { return this._paths; }
}

console.time("solution")
readLines("input.txt").then(lines => {
  const graph = new Graph();
  for (const line of lines) {
    const [left, right] = line.split("-")
    graph.addConnection(left, right);
  }
  graph.findPaths("start", "end", new Set(), false);
  console.timeEnd("solution")
  // console.log(graph.paths);
  console.log(graph.paths.length);
})
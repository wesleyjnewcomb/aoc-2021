import { readLines } from "../helpers";

interface TreeNode {
  weight: number;
  left?: TreeNode;
  right?: TreeNode;
}

function processString(str: string, root: TreeNode): void {
  root.weight++;
  if (str.length === 0) return;
  if (str[0] === "0") {
    if (!root.left) root.left = { weight: 0 }
    processString(str.slice(1), root.left);
    return;
  }
  if (str[0] === "1") {
    if (!root.right) root.right = { weight: 0 }
    processString(str.slice(1), root.right);
    return;
  }
}

function traverseTreeHeavier(root: TreeNode): string {
  let str = ""
  let currNode = root;
  while (currNode.right || currNode.left) {
    if (currNode.right) {
      if (currNode.left && currNode.left.weight > currNode.right.weight) {
        // go left
        str += "0";
        currNode = currNode.left;
      } else {
        // go right
        str += "1";
        currNode = currNode.right;
      }
    } else if (currNode.left) {
      // go left
      str += "0";
      currNode = currNode.left;
    }
  }
  return str;
}

function traverseTreeLighter(root: TreeNode): string {
  let str = ""
  let currNode = root;
  while (currNode.left || currNode.right) {
    if (currNode.right) {
      if (currNode.left && currNode.left.weight <= currNode.right.weight) {
        // go left
        str += "0";
        currNode = currNode.left;
      } else {
        // go right
        str += "1";
        currNode = currNode.right;
      }
    } else if (currNode.left) {
      str += "0";
      currNode = currNode.left;
    }
  }
  return str;
}

readLines("input.txt").then(nums => {
  const root = { weight: 0 }
  for (const num of nums) {
    processString(num, root);
  }
  const o2rating = traverseTreeHeavier(root);
  const co2rating = traverseTreeLighter(root);
  console.log(
    o2rating,
    co2rating,
    parseInt(o2rating, 2) * parseInt(co2rating,2)
  )
})



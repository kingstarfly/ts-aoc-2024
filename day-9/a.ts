import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day9a(data: string[]) {
  // Keep array of position -> ID block
  // Maintain two pointers.
  // Left pointer is in charge of finding empty block from left.
  // Right pointer is in charge of occupied block from right.
  // When left pointer reaches right pointer, then we have fully compacted.

  const digits = data[0];
  if (digits.length === 0) {
    return 0;
  }

  const blocks: number[] = [];
  let mode: "file" | "free" = "file";
  let currentId = 0;
  for (let i = 0; i < digits.length; i++) {
    const numBlocks = parseInt(digits[i]);
    if (mode === "file") {
      for (let j = 0; j < numBlocks; j++) {
        blocks.push(currentId);
      }
      currentId++;
      mode = "free";
    } else {
      for (let j = 0; j < numBlocks; j++) {
        blocks.push(null);
      }
      mode = "file";
    }
  }

  let leftPointer = 0;
  // Go to first empty block
  while (leftPointer < blocks.length && blocks[leftPointer] !== null) {
    leftPointer++;
  }

  let rightPointer = blocks.length - 1;
  // Go to first occupied block
  while (rightPointer >= 0 && blocks[rightPointer] === null) {
    rightPointer--;
  }

  while (true) {
    if (leftPointer >= rightPointer) break;

    // Bring occupied block to empty block.
    blocks[leftPointer] = blocks[rightPointer];
    blocks[rightPointer] = null;

    // Advance both pointers
    while (leftPointer < blocks.length && blocks[leftPointer] !== null) {
      leftPointer++;
    }
    while (rightPointer >= 0 && blocks[rightPointer] === null) {
      rightPointer--;
    }
  }

  console.log(blocks);

  return blocks.reduce((accumulatedValue, block, index) => {
    if (block === null) return accumulatedValue;
    return accumulatedValue + block * index;
  }, 0);
}

await runSolution(day9a);

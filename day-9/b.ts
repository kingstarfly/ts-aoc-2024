import { runSolution } from "../utils.ts";

type LinkedListNode = {
  beforeNode: LinkedListNode | null;
  nextNode: LinkedListNode | null;
  startIndex: number;
  endIndex: number;
};

type StackNode = {
  startIndex: number;
  endIndex: number;
  id: number;
};

/** provide your solution as the return of this function */
export async function day9b(data: string[]) {
  // Keep array of position -> ID block
  // Maintain information of empty chain of blocks -> Their start and end index inclusive.
  // Maintain stack of occupied chain of blocks -> Their start and end index inclusive.
  // Pop stack of occupied chain of blocks, try to find empty chain of blocks by searching from left to right.
  // If found, replace the blocks with the ID and set current blocks to null. Splice the empty chain of blocks.
  // Empty chain of blocks should be a linked list.

  const occupiedChainStack: StackNode[] = [];

  const headOfEmptyChainLinkedList: LinkedListNode = {
    startIndex: -1,
    endIndex: -1,
    beforeNode: null,
    nextNode: null,
  };
  let currentLinkedListNode = headOfEmptyChainLinkedList;

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
      occupiedChainStack.push({
        id: currentId,
        startIndex: blocks.length,
        endIndex: blocks.length + numBlocks - 1,
      });
      for (let j = 0; j < numBlocks; j++) {
        blocks.push(currentId);
      }

      currentId++;
      mode = "free";
    } else {
      const newLinkedListNode: LinkedListNode = {
        startIndex: blocks.length,
        endIndex: blocks.length + numBlocks - 1,
        beforeNode: currentLinkedListNode,
        nextNode: null,
      };
      currentLinkedListNode.nextNode = newLinkedListNode;
      currentLinkedListNode = newLinkedListNode;

      for (let j = 0; j < numBlocks; j++) {
        blocks.push(null);
      }

      mode = "file";
    }
  }

  currentLinkedListNode = headOfEmptyChainLinkedList.nextNode;
  // Check if there are any empty chain of blocks.
  if (currentLinkedListNode === null) {
    return 0;
  }

  console.log({ occupiedChainStack });

  while (occupiedChainStack.length > 0) {
    const occupiedChain = occupiedChainStack.pop();
    const occupiedChainLength =
      occupiedChain.endIndex - occupiedChain.startIndex + 1;

    // Find empty chain of blocks by searching from left to right.
    currentLinkedListNode = headOfEmptyChainLinkedList.nextNode;

    while (currentLinkedListNode !== null) {
      const emptyChainLength =
        currentLinkedListNode.endIndex - currentLinkedListNode.startIndex + 1;

      // Check that the empty chain of blocks is not to the right of the occupied chain.
      if (currentLinkedListNode.startIndex > occupiedChain.startIndex) {
        break;
      }

      if (emptyChainLength >= occupiedChainLength) {
        // We can move the occupied chain to the empty chain.
        for (let i = 0; i < occupiedChainLength; i++) {
          blocks[currentLinkedListNode.startIndex + i] = occupiedChain.id;
          blocks[occupiedChain.startIndex + i] = null;
        }

        // Modify the linked list node's start index. If new empty chain length is 0, then we remove the node.
        if (emptyChainLength === occupiedChainLength) {
          const nodeToRemove = currentLinkedListNode;
          // Move the pointer to the next node before removing the current node.
          currentLinkedListNode = currentLinkedListNode.nextNode;
          removeNode(nodeToRemove);
        } else {
          currentLinkedListNode.startIndex += occupiedChainLength;
        }

        // We don't need to search for more empty chains of blocks.
        break;
      } else {
        // Check next node to see if it's long enough.
        currentLinkedListNode = currentLinkedListNode.nextNode;
      }
    }

    console.log(blocks);
  }

  return blocks.reduce((accumulatedValue, block, index) => {
    if (block === null) return accumulatedValue;
    return accumulatedValue + block * index;
  }, 0);
}

function removeNode(node: LinkedListNode) {
  const beforeNode = node.beforeNode;
  const nextNode = node.nextNode;
  if (beforeNode !== null) {
    beforeNode.nextNode = nextNode;
  }
  if (nextNode !== null) {
    nextNode.beforeNode = beforeNode;
  }
  return;
}

await runSolution(day9b);

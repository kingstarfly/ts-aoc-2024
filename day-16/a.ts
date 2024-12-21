import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import { runSolution } from "../utils.ts";

type Direction = "N" | "S" | "E" | "W";
type Node = {
  x: number;
  y: number;
  score: number;
  direction: Direction;
};

/** provide your solution as the return of this function */
export async function day16a(data: string[]) {
  // Use priority queue to decide next cell to visit.

  const MAX_Y = data.length - 1;
  const MAX_X = data[0].length - 1;

  const queue = new MinPriorityQueue<Node>((node) => node.score);
  const visited = new Set<string>();

  // Find the S.
  let firstNode: Node = undefined;
  for (let y = 0; y <= MAX_Y; y++) {
    for (let x = 0; x <= MAX_X; x++) {
      if (data[y][x] === "S") {
        firstNode = {
          x,
          y,
          score: 0,
          direction: "E",
        };
        break;
      }
    }
  }

  queue.enqueue(firstNode);

  while (queue.size() > 0) {
    console.log(queue.toArray());
    const currentNode = queue.dequeue();
    visited.add(`${currentNode.x},${currentNode.y}`);
    console.log({ currentNode });

    if (data[currentNode.y][currentNode.x] === "E") {
      return currentNode.score;
    }

    // Add all possible paths to the queue.
    const directions = {
      N: [0, -1],
      E: [1, 0],
      S: [0, 1],
      W: [-1, 0],
    };

    const currentDirectionIndex = Object.keys(directions).indexOf(
      currentNode.direction
    );

    const possibleDirectionIndexes = [
      currentDirectionIndex - 1,
      currentDirectionIndex,
      currentDirectionIndex + 1,
    ].map((index) => (index > 3 ? index - 4 : index < 0 ? index + 4 : index));

    for (const directionIndex of possibleDirectionIndexes) {
      const [direction, offset] = Object.entries(directions)[
        directionIndex
      ] as [Direction, number[]];

      const nextX = currentNode.x + offset[0];
      const nextY = currentNode.y + offset[1];

      if (visited.has(`${nextX},${nextY}`)) {
        continue;
      }

      if (nextX < 0 || nextX > MAX_X || nextY < 0 || nextY > MAX_Y) {
        continue;
      }

      if (data[nextY][nextX] === "#") {
        continue;
      }

      if (direction === currentNode.direction) {
        queue.enqueue({
          x: nextX,
          y: nextY,
          score: currentNode.score + 1,
          direction: direction,
        });
      } else {
        queue.enqueue({
          x: nextX,
          y: nextY,
          score: currentNode.score + 1001,
          direction: direction,
        });
      }
    }
  }
  return 0;
}

await runSolution(day16a);

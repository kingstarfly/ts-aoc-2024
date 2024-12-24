import { Deque } from "@datastructures-js/deque";
import { runSolution } from "../utils.ts";
import _ from "lodash";

/** provide your solution as the return of this function */
export async function day20a(data: string[]) {
  const MAX_Y = data.length - 1;
  const MAX_X = data[0].length - 1;

  const wallSet = new Set<string>();
  const trackSet = new Set<string>();

  let startPosition: string | undefined;
  let endPosition: string | undefined;
  for (let y = 0; y <= MAX_Y; y++) {
    for (let x = 0; x <= MAX_X; x++) {
      const char = data[y][x];
      if (char === "#") {
        wallSet.add(`${x},${y}`);
      } else {
        trackSet.add(`${x},${y}`);
        if (char === "S") {
          startPosition = `${x},${y}`;
        }
        if (char === "E") {
          endPosition = `${x},${y}`;
        }
      }
    }
  }

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const costs = new Map<string, number>();
  costs.set(startPosition, 0);

  function isOutOfBound(position: string) {
    const [x, y] = position.split(",").map(Number);
    return x < 0 || x > MAX_X || y < 0 || y > MAX_Y;
  }

  console.log({ startPosition, endPosition });

  function getShortestPath() {
    let queue = new Deque([startPosition]);
    const visited = new Set<string>([startPosition]);

    while (queue.size() > 0) {
      const nextQueue = new Deque<string>();

      for (const current of queue.toArray()) {
        const currentCost = costs.get(current);
        const [x, y] = current.split(",").map(Number);

        for (let i = 0; i < 4; i++) {
          const [dx, dy] = directions[i];
          const nx = x + dx;
          const ny = y + dy;
          const next = `${nx},${ny}`;
          if (isOutOfBound(next)) {
            continue;
          }

          if (wallSet.has(next)) {
            continue;
          }

          if (visited.has(next)) {
            continue;
          }
          if (next === endPosition) {
            // costs.set(next, currentCost + 1);
            return currentCost + 1;
          }

          visited.add(next);
          costs.set(next, currentCost + 1);
          nextQueue.pushBack(next);
        }
      }
      queue = nextQueue;
    }
  }

  const originalTime = getShortestPath();
  console.log({ originalTime });

  // From each position in the costs map, extend 2 positions in any combination, and see if we link to another position.
  // If the new position is >= 100 smaller, then this is a good cheat location.

  const MIN_TIME_SAVINGS = 100;
  const allSavings = [];

  for (const [startLocation, cost] of costs) {
    const [x, y] = startLocation.split(",").map(Number);

    for (const direction1 of directions) {
      for (const direction2 of directions) {
        const [dx1, dy1] = direction1;
        const [dx2, dy2] = direction2;
        const nx = x + dx1 + dx2;
        const ny = y + dy1 + dy2;
        if (x === nx && y === ny) {
          continue;
        }

        const savings = cost - (costs.get(`${nx},${ny}`) ?? originalTime) - 2;

        if (savings > 0) {
          allSavings.push(savings);
        }
      }
    }
  }

  const counts = _.countBy(allSavings);
  console.log({ counts });

  return allSavings.filter((savings) => savings >= MIN_TIME_SAVINGS).length;
}

await runSolution(day20a);

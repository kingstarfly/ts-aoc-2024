import { Deque } from "@datastructures-js/deque";
import { runSolution } from "../utils.ts";
import _ from "lodash";

/** provide your solution as the return of this function */
export async function day20b(data: string[]) {
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
            costs.set(next, currentCost + 1);
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
  // console.log({ costs });

  // From each position in the costs map, extend 2 positions in any combination, and see if we link to another position.
  // If the new position is >= 50 smaller, then this is a good cheat location.

  const MIN_TIME_SAVINGS = 100;

  // startLocation, endLocation -> savings
  const cheatToSavingsMap = new Map<string, number>();
  const MAX_STEPS = 20;

  function* getNeighborsWithinManhattanDistance(
    position: string
  ): Generator<{ nextLocation: string; stepsTaken: number }> {
    const [startX, startY] = position.split(",").map(Number);

    // For each distance d from 0 to maxDistance
    for (let d = 0; d <= MAX_STEPS; d++) {
      // For each x-offset from -d to +d
      for (let dx = -d; dx <= d; dx++) {
        // The remaining distance must be used in the y direction
        const remainingDist = d - Math.abs(dx);
        // We need two y values: +remaining and -remaining
        const dy_values =
          remainingDist === 0 ? [0] : [remainingDist, -remainingDist];

        for (const dy of dy_values) {
          const nx = startX + dx;
          const ny = startY + dy;
          const next = `${nx},${ny}`;

          if (isOutOfBound(next)) {
            continue;
          }

          yield {
            nextLocation: next,
            stepsTaken: d, // Manhattan distance is our actual steps taken
          };
        }
      }
    }
  }

  for (const [startLocation, cost] of costs) {
    for (const {
      nextLocation,
      stepsTaken,
    } of getNeighborsWithinManhattanDistance(startLocation)) {
      const savings =
        cost - (costs.get(nextLocation) ?? originalTime) - stepsTaken;

      if (savings >= MIN_TIME_SAVINGS) {
        // console.log(`${nextLocation} -> ${startLocation}: ${savings}`);
        const cheatKey = `${nextLocation},${startLocation}`;
        if (!cheatToSavingsMap.has(cheatKey)) {
          cheatToSavingsMap.set(cheatKey, savings);
        } else {
          // Only update if the savings is higher
          if (cheatToSavingsMap.get(cheatKey) < savings) {
            cheatToSavingsMap.set(cheatKey, savings);
          }
        }
      }
    }
  }

  // console.log(cheatToSavingsMap);
  const savings = Array.from(cheatToSavingsMap.values());

  const counts = _.countBy(savings);
  // console.log({ counts });

  return savings.filter((savings) => savings >= MIN_TIME_SAVINGS).length;
}

await runSolution(day20b);

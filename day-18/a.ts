import { Deque } from "@datastructures-js/deque";
import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day18a(data: string[]) {
  const MAX_Y = 70;
  const MAX_X = 70;
  const bytesDropped = 1024;

  // simulate the bytes dropped and do BFS to find shortest path to exit.

  const wallSet = new Set<string>();

  for (let i = 0; i < bytesDropped; i++) {
    const [x, y] = data[i].split(",").map(Number);
    wallSet.add(`${x},${y}`);
  }

  function printState() {
    for (let y = 0; y <= MAX_Y; y++) {
      for (let x = 0; x <= MAX_X; x++) {
        const wall = wallSet.has(`${x},${y}`);
        process.stdout.write(wall ? "#" : ".");
      }
      console.log("");
    }
  }

  printState();

  function getNext(x: number, y: number, direction: number) {
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    const [nx, ny] = directions[direction];
    return [x + nx, y + ny];
  }

  function isOutOfBound(x: number, y: number) {
    return x < 0 || x > MAX_X || y < 0 || y > MAX_Y;
  }

  // Start BFS
  let queue = new Deque([`0,0`]);
  const visited = new Set<string>();
  let distance = 0;

  while (true) {
    const nextQueue = new Deque<string>();
    console.log(queue.toArray());

    for (const current of queue.toArray()) {
      const [x, y] = current.split(",").map(Number);

      if (x === MAX_X && y === MAX_Y) {
        return distance;
      }

      for (let i = 0; i < 4; i++) {
        const [nx, ny] = getNext(x, y, i);
        const next = `${nx},${ny}`;
        if (wallSet.has(next)) {
          continue;
        }
        if (visited.has(next)) {
          continue;
        }
        if (isOutOfBound(nx, ny)) {
          continue;
        }
        visited.add(next);
        nextQueue.pushBack(next);
      }
    }

    queue = nextQueue;
    distance++;
  }

  return 0;
}

await runSolution(day18a);

import { runSolution } from "../utils.ts";

type Position = {
  x: number;
  y: number;
};

/** provide your solution as the return of this function */
export async function day10b(data: string[]) {
  console.log(data);
  // Start at every 0, and try to visit 9.
  if (data.length === 0 || data[0].length === 0) {
    return 0;
  }
  const MAX_Y = data.length - 1;
  const MAX_X = data[0].length - 1;

  const trailheadPositions: Position[] = [];

  for (let y = 0; y <= MAX_Y; y++) {
    for (let x = 0; x <= MAX_X; x++) {
      if (data[y][x] === "0") {
        trailheadPositions.push({ x, y });
      }
    }
  }

  function withinMap(position: Position) {
    return (
      position.x >= 0 &&
      position.x <= MAX_X &&
      position.y >= 0 &&
      position.y <= MAX_Y
    );
  }

  function getPeaksReachable(position: Position) {
    const digit = data[position.y][position.x];
    if (digit === "9") {
      return 1;
    }

    const expectedNextHeight = `${parseInt(digit) + 1}`;

    const change = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    let peaksReachable = 0;
    for (const [dx, dy] of change) {
      const nextPosition: Position = {
        x: position.x + dx,
        y: position.y + dy,
      };

      if (!withinMap(nextPosition)) {
        continue;
      }
      if (data[nextPosition.y][nextPosition.x] !== expectedNextHeight) {
        continue;
      }

      peaksReachable += getPeaksReachable(nextPosition);
    }

    return peaksReachable;
  }

  let score = 0;
  for (const trailheadPosition of trailheadPositions) {
    const peaksReachable = getPeaksReachable(trailheadPosition);
    console.log({ trailheadPosition, peaksReachable });
    score += peaksReachable;
  }

  return score;
}

await runSolution(day10b);

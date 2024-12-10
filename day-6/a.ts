import { runSolution } from "../utils.ts";

type Coord = {
  x: number;
  y: number;
};
/** provide your solution as the return of this function */
export async function day6a(data: string[]) {
  const lines = data.filter((line) => line.length > 0);
  // maintain a set of unique positions (x, y) - Space: O(x * y)
  // maintain current position + direction - Space: O(1)
  // runtime is potentially never ending...
  const uniquePositions = new Set<string>();
  if (lines.length === 0 || lines[0].length === 0) {
    return 0;
  }
  const maxY = lines.length - 1;
  const maxX = lines[0].length - 1;

  // (dx, dy)
  const directions = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  let directionIndex = 0;

  let currentPosition: Coord = {
    x: -1,
    y: -1,
  };
  // Find current position
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      if (lines[y][x] === "^") {
        currentPosition = { x, y };
        break;
      }
    }
  }
  if (currentPosition[0] === -1 || currentPosition[1] === -1) {
    throw "Starting position not found in lines";
  }
  uniquePositions.add(`${currentPosition.x},${currentPosition.y}`);

  function isOutside(position: Coord) {
    return (
      position.x < 0 || position.x > maxX || position.y < 0 || position.y > maxY
    );
  }

  function getNextPosition(currentPosition: Coord, directionIndex: number) {
    return {
      x: currentPosition.x + directions[directionIndex][0],
      y: currentPosition.y + directions[directionIndex][1],
    };
  }

  let nextPosition = undefined;

  while (true) {
    console.log(currentPosition);
    if (isOutside(currentPosition)) {
      console.log(uniquePositions);
      return uniquePositions.size;
    }

    uniquePositions.add(`${currentPosition.x},${currentPosition.y}`);

    // Either progress forward or turn.
    nextPosition = getNextPosition(currentPosition, directionIndex);
    if (
      !isOutside(nextPosition) &&
      lines[nextPosition.y][nextPosition.x] === "#"
    ) {
      directionIndex = (directionIndex + 1) % directions.length;
      console.log("turning to new direction index", directionIndex);
    } else {
      currentPosition = nextPosition;
    }
  }
}

await runSolution(day6a);

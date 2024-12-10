import { runSolution } from "../utils.ts";

type Coord = {
  x: number;
  y: number;
};

/** provide your solution as the return of this function */
export async function day6b(data: string[]) {
  // Keep set if position + direction visited.
  // Try putting obstacles in all available positions and check if any position+direction is visited twice -> This will result in a loop.
  const lines = data.filter((line) => line.length > 0);
  if (lines.length === 0 || lines[0].length === 0) {
    return 0;
  }

  // (dx, dy)
  const directions = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];

  const maxY = lines.length - 1;
  const maxX = lines[0].length - 1;
  // Find starting position
  let startingPosition: Coord = {
    x: -1,
    y: -1,
  };
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      if (lines[y][x] === "^") {
        startingPosition = { x, y };
      }
    }
  }

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

  function searchForLoop(
    startingPosition: Coord,
    obstaclePosition: Coord,
    visitedPositionsWithDirection: Set<string>
  ) {
    let directionIndex = 0;
    let nextPosition = undefined;

    // Start with adding the initial position and direction
    visitedPositionsWithDirection.add(
      `${obstaclePosition.x},${obstaclePosition.y},${directionIndex}`
    );

    let currentPosition = startingPosition;

    while (true) {
      if (isOutside(currentPosition)) {
        return false;
      }

      const currentPositionWithDirection = `${currentPosition.x},${currentPosition.y},${directionIndex}`;

      if (visitedPositionsWithDirection.has(currentPositionWithDirection)) {
        // console.log(obstaclePosition, visitedPositionsWithDirection);
        return true;
      }

      visitedPositionsWithDirection.add(currentPositionWithDirection);

      // Either progress forward or turn.
      nextPosition = getNextPosition(currentPosition, directionIndex);
      if (
        !isOutside(nextPosition) &&
        (lines[nextPosition.y][nextPosition.x] === "#" ||
          (nextPosition.y === obstaclePosition.y &&
            nextPosition.x === obstaclePosition.x))
      ) {
        directionIndex = (directionIndex + 1) % directions.length;
      } else {
        currentPosition = nextPosition;
      }
    }
  }

  let count = 0;

  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      // Cannot put obstacles on the starting position
      if (x === startingPosition.x && y === startingPosition.y) {
        continue;
      }
      const obstaclePosition: Coord = { x, y };
      if (
        searchForLoop(startingPosition, obstaclePosition, new Set<string>()) ===
        true
      ) {
        count += 1;
      }
    }
  }

  return count;
}

await runSolution(day6b);

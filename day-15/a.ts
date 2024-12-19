import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day15a(data: string[]) {
  // Use a array to store the prev box that we skipped to check if we can move the box.
  // Simulate step by step.
  // Use a Set to store the box positions, and separate Set to store the wall positions.

  const separatorIndex = data.indexOf("");
  const initialState = data.slice(0, separatorIndex);
  const directions = data
    .slice(separatorIndex + 1)
    .join("")
    .split("") as ("<" | ">" | "^" | "v")[];

  const boxPositions = new Set<string>();
  const wallPositions = new Set<string>();

  const MIN_Y = 1;
  const MAX_Y = initialState.length - 2;

  const MIN_X = 1;
  const MAX_X = initialState[0].length - 2;

  let robotPosition: string | null = null;
  for (let y = MIN_Y - 1; y <= MAX_Y + 1; y++) {
    for (let x = MIN_X - 1; x <= MAX_X + 1; x++) {
      const char = initialState[y][x];
      if (char === "O") {
        boxPositions.add(`${x},${y}`);
      } else if (char === "#") {
        wallPositions.add(`${x},${y}`);
      } else if (char === "@") {
        robotPosition = `${x},${y}`;
      }
    }
  }

  printState();

  function printState() {
    for (let y = MIN_Y - 1; y <= MAX_Y + 1; y++) {
      for (let x = MIN_X - 1; x <= MAX_X + 1; x++) {
        const positionString = `${x},${y}`;
        if (wallPositions.has(positionString)) {
          process.stdout.write("#");
        } else if (boxPositions.has(positionString)) {
          process.stdout.write("O");
        } else if (robotPosition === positionString) {
          process.stdout.write("@");
        } else {
          process.stdout.write(".");
        }
      }
      process.stdout.write("\n");
    }

    console.log("");
  }

  /**
   * Checks if the box can be moved in the given direction.
   * If the box can be moved, it will move the box and return true.
   * Otherwise, it will return false.
   */
  function moveBox(direction: "<" | ">" | "^" | "v", boxPosition: string) {
    const [x, y] = toPos(boxPosition);
    // Check if able to move left.
    let neighborPosition: string | null = null;
    if (direction === "<") {
      neighborPosition = `${x - 1},${y}`;
    } else if (direction === ">") {
      neighborPosition = `${x + 1},${y}`;
    } else if (direction === "^") {
      neighborPosition = `${x},${y - 1}`;
    } else if (direction === "v") {
      neighborPosition = `${x},${y + 1}`;
    }

    if (wallPositions.has(neighborPosition)) {
      return false;
    }

    if (!boxPositions.has(neighborPosition)) {
      boxPositions.delete(boxPosition);
      boxPositions.add(neighborPosition);
      return true;
    }

    const canMove = moveBox(direction, neighborPosition);

    if (canMove) {
      boxPositions.delete(boxPosition);
      boxPositions.add(neighborPosition);
    }

    return canMove;
  }

  for (const direction of directions) {
    printState();

    const [x, y] = toPos(robotPosition!);
    let neighborPosition: string | null = null;
    if (direction === "<") {
      neighborPosition = `${x - 1},${y}`;
    } else if (direction === ">") {
      neighborPosition = `${x + 1},${y}`;
    } else if (direction === "^") {
      neighborPosition = `${x},${y - 1}`;
    } else if (direction === "v") {
      neighborPosition = `${x},${y + 1}`;
    }

    if (wallPositions.has(neighborPosition)) {
      continue;
    }

    if (!boxPositions.has(neighborPosition)) {
      robotPosition = neighborPosition;
      continue;
    }

    // Else, it's a box.
    const hasMovedBox = moveBox(direction, neighborPosition);
    if (hasMovedBox) {
      robotPosition = neighborPosition;
    }
  }

  // Return the score based on box positions.
  let score = 0;
  for (const boxPosition of boxPositions) {
    const [x, y] = toPos(boxPosition);
    score += y * 100 + x;
  }
  return score;
}

await runSolution(day15a);

function toPos(positionString: string) {
  return positionString.split(",").map(Number);
}

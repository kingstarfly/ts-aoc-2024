import { runSolution } from "../utils.ts";

type Direction = "^" | "v" | "<" | ">";

const leftPositionToBoxMap = new Map<string, Box>();
const wallPositions = new Set<string>();

class Box {
  y: number;
  leftX: number;
  rightX: number;

  constructor(y: number, leftX: number, rightX?: number) {
    this.leftX = leftX;
    this.rightX = rightX ?? leftX + 1;
    this.y = y;
  }

  toString() {
    return `${this.leftX},${this.y}`;
  }

  checkMove(direction: Direction): Box[] {
    // Horizontal
    // Check if there's a wall
    // Check if it's empty
    // Check recursively
    if (direction === "<" || direction === ">") {
      const nextPosition = `${
        direction === "<" ? this.leftX - 1 : this.rightX + 1
      },${this.y}`;

      if (wallPositions.has(nextPosition)) {
        return [];
      }

      let nextBox: Box = null;
      if (direction === "<") {
        const nextBoxLeftPosition = `${this.leftX - 2},${this.y}`;
        nextBox = leftPositionToBoxMap.get(nextBoxLeftPosition);
        if (!nextBox) {
          return [this];
        }
      } else {
        const nextBoxLeftPosition = `${this.rightX + 1},${this.y}`;
        nextBox = leftPositionToBoxMap.get(nextBoxLeftPosition);
        if (!nextBox) {
          return [this];
        }
      }

      const boxesToMove: Box[] = [this];
      boxesToMove.push(nextBox);

      const nextNextBoxesToMove = nextBox.checkMove(direction);
      if (nextNextBoxesToMove.length === 0) {
        return [];
      }

      // Let the next boxes be last in array so we can pop later.
      for (const nextNextBox of nextNextBoxesToMove) {
        if (!boxesToMove.includes(nextNextBox)) {
          boxesToMove.push(nextNextBox);
        }
      }
      return boxesToMove;
    }

    // Vertical
    const nextY = direction === "^" ? this.y - 1 : this.y + 1;
    if (
      wallPositions.has(`${this.leftX},${nextY}`) ||
      wallPositions.has(`${this.rightX},${nextY}`)
    ) {
      return [];
    }

    const positionsToCheck = [
      `${this.leftX - 1},${nextY}`,
      `${this.leftX},${nextY}`,
      `${this.rightX},${nextY}`,
    ];

    const boxesToCheck = positionsToCheck
      .map((position) => {
        const box = leftPositionToBoxMap.get(position);
        if (box) {
          return box;
        }

        return null;
      })
      .filter((box) => box !== null);

    const boxesToMove: Box[] = [this];
    for (const boxToCheck of boxesToCheck) {
      if (!boxesToMove.includes(boxToCheck)) {
        boxesToMove.push(boxToCheck);
      }
      const nextBoxesToMove = boxToCheck.checkMove(direction);
      if (nextBoxesToMove.length === 0) {
        return [];
      }
      for (const nextBox of nextBoxesToMove) {
        if (!boxesToMove.includes(nextBox)) {
          boxesToMove.push(nextBox);
        }
      }
    }

    return boxesToMove;
  }

  commitMove(direction: Direction, ignoreMap: boolean = false) {
    const oldString = this.toString();
    switch (direction) {
      case "^":
        this.y -= 1;
        break;
      case "v":
        this.y += 1;
        break;
      case "<":
        this.leftX -= 1;
        this.rightX -= 1;
        break;
      case ">":
        this.leftX += 1;
        this.rightX += 1;
        break;
    }

    if (ignoreMap) return;

    leftPositionToBoxMap.delete(oldString);
    leftPositionToBoxMap.set(this.toString(), this);
  }
}

/** provide your solution as the return of this function */
export async function day15b(data: string[]) {
  // Use a array to store the prev box that we skipped to check if we can move the box.
  // Simulate step by step.
  // Use a Set to store the box positions, and separate Set to store the wall positions.

  const separatorIndex = data.indexOf("");
  const initialState = data.slice(0, separatorIndex);
  const directions = data
    .slice(separatorIndex + 1)
    .join("")
    .split("") as ("<" | ">" | "^" | "v")[];

  const MAX_Y = initialState.length - 1;
  const MAX_X = initialState[0].length - 1;

  let robotPosition: string | null = null;
  for (let y = 0; y <= MAX_Y; y++) {
    for (let x = 0; x <= MAX_X; x++) {
      const char = initialState[y][x];
      if (char === "O") {
        const box = new Box(y, 2 * x);
        leftPositionToBoxMap.set(box.toString(), box);
      } else if (char === "#") {
        wallPositions.add(`${2 * x},${y}`);
        wallPositions.add(`${2 * x + 1},${y}`);
      } else if (char === "@") {
        // Robot is only width of 1
        robotPosition = `${2 * x},${y}`;
      }
    }
  }

  printState();

  function printState() {
    for (let y = 0; y <= MAX_Y; y++) {
      for (let x = 0; x <= MAX_X * 2 + 1; x++) {
        const positionString = `${x},${y}`;
        if (wallPositions.has(positionString)) {
          process.stdout.write("#");
        } else if (leftPositionToBoxMap.has(positionString)) {
          process.stdout.write("[");
        } else if (leftPositionToBoxMap.has(`${x - 1},${y}`)) {
          process.stdout.write("]");
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

  for (const direction of directions) {
    const [robotX, robotY] = robotPosition.split(",").map(Number);

    // Fake the robot as a box with leftX and rightX equal.
    const robotBox = new Box(robotY, robotX, robotX);
    const boxesToMove = robotBox.checkMove(direction);
    const canMove = boxesToMove.length > 0;

    // console.log({ direction });
    // console.log({ boxesToMove });

    while (boxesToMove.length > 0) {
      const boxToMove = boxesToMove.pop();

      // skip the robot box
      if (boxToMove === robotBox) {
        boxToMove.commitMove(direction, true);
      } else {
        boxToMove.commitMove(direction);
      }
    }

    if (canMove) {
      robotPosition = robotBox.toString();
    }
    // printState();
  }

  // Return the score based on box positions.
  let score = 0;
  for (const leftBoxPosition of leftPositionToBoxMap.keys()) {
    const [x, y] = toPos(leftBoxPosition);
    score += y * 100 + x;
  }
  return score;
}

await runSolution(day15b);

function toPos(positionString: string) {
  return positionString.split(",").map(Number);
}

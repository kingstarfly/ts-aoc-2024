import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day4b(data: string[]) {
  // Count the number of A's where diagonal adjacent are "M" and "S" for both diagonals.
  if (data.length === 0) {
    return 0;
  }
  const maxY = data.length;
  const maxX = data[0].length;

  function isTarget(x: number, y: number) {
    if (x < 1 || x >= maxX - 1 || y < 1 || y >= maxY - 1) {
      return false;
    }

    if (data[y][x] !== "A") {
      return false;
    }

    // Get letters on top left and bottom right
    const topLeft = data[y - 1][x - 1];
    const bottomRight = data[y + 1][x + 1];

    let criteria = 0;
    if (
      (topLeft === "M" && bottomRight === "S") ||
      (topLeft === "S" && bottomRight === "M")
    ) {
      criteria += 1;
    }

    // Get letters on top right and bottom left
    const topRight = data[y - 1][x + 1];
    const bottomLeft = data[y + 1][x - 1];

    if (
      (topRight === "M" && bottomLeft === "S") ||
      (topRight === "S" && bottomLeft === "M")
    ) {
      criteria += 1;
    }

    return criteria === 2;
  }

  let totalScore = 0;
  for (let y = 1; y < maxY - 1; y++) {
    for (let x = 1; x < maxX - 1; x++) {
      if (isTarget(x, y)) {
        totalScore += 1;
      }
    }
  }

  return totalScore;
}

await runSolution(day4b);

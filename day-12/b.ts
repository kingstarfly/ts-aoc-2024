import { runSolution } from "../utils.ts";

type RegionDetail = {
  label: string;
  perimeter: number;
  area: number;
};
/** provide your solution as the return of this function */
export async function day12b(data: string[]) {
  // How to find number of SIDES easily everytime we add a plot to a region?
  // How many unique Ys + 1 + unique Xs +  -> No
  // Can we use perimeter and reduce to find number of sides?

  const lines = data.filter((line) => line.length > 0);
  if (lines.length === 0) return 0;
  if (lines[0].length === 0) return 0;
  const MAX_Y = lines.length - 1;
  const MAX_X = lines[0].length - 1;

  const globalVisitedPositions = new Set<string>();

  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // Fill up global visitedPositions and local visitedPositions for this run.
  function exploreRegion(
    x: number,
    y: number,
    regionDetail: RegionDetail,
    localVisitedPositions: Set<string>
  ): void {
    const positionString = `${x},${y}`;
    if (globalVisitedPositions.has(positionString)) {
      return;
    }

    // If current label is not part of the region, then we're done.
    const currentLabel = lines[y][x];
    if (regionDetail.label !== currentLabel) {
      return;
    }

    globalVisitedPositions.add(positionString);
    localVisitedPositions.add(positionString);

    // Add to the region.
    regionDetail.area++;

    // Perimeter calculation.
    regionDetail.perimeter += getIncrementalPerimeter(x, y);

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      if (withinBounds(newX, newY)) {
        exploreRegion(newX, newY, regionDetail, localVisitedPositions);
      }
    }

    return;
  }

  function getIncrementalPerimeter(x: number, y: number) {
    const currentLabel = lines[y][x];

    let change = 4;

    // Look at neighbors to count how many same and different labels.
    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      if (withinBounds(newX, newY)) {
        if (lines[newY][newX] === currentLabel) {
          change -= 1;
        }
      }
    }

    return change;
  }

  function withinBounds(x: number, y: number) {
    return x >= 0 && x <= MAX_X && y >= 0 && y <= MAX_Y;
  }

  function getRegion(positionString: string) {
    const [x, y] = positionString.split(",").map((chars) => parseInt(chars));
    console.log({ y, x });
    return lines[y][x];
  }

  function checkPositionStringWithinBounds(positionString: string) {
    const [x, y] = positionString.split(",").map((chars) => parseInt(chars));
    return withinBounds(x, y);
  }

  function calculateNumSides(positionsInRegion: Set<string>) {
    // Find the number of corners.
    // External corner exists if any of the flanking 2 corners side is not the same region.
    // Internal corner exists if L shape exists in the same region and the opposite plot is not the same region.

    function checkExternalCorner(positionString: string) {
      const [x, y] = positionString.split(",").map((chars) => parseInt(chars));
      const currentRegion = getRegion(positionString);
      let corners = 0;

      const diffs = [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ];

      for (const [xDiff, yDiff] of diffs) {
        const plot1 = `${x + xDiff},${y}`;
        const plot2 = `${x},${y + yDiff}`;

        if (
          (!checkPositionStringWithinBounds(plot1) ||
            getRegion(plot1) !== currentRegion) &&
          (!checkPositionStringWithinBounds(plot2) ||
            getRegion(plot2) !== currentRegion)
        ) {
          corners += 1;
        }
      }

      return corners;
    }

    function checkInternalCorner(positionString: string) {
      const [x, y] = positionString.split(",").map((chars) => parseInt(chars));
      const currentRegion = getRegion(positionString);
      let corners = 0;

      const diffs = [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ];

      for (const [xDiff, yDiff] of diffs) {
        const plot1 = `${x + xDiff},${y}`;
        const plot2 = `${x},${y + yDiff}`;
        const plot3 = `${x + xDiff},${y + yDiff}`;

        if (
          checkPositionStringWithinBounds(plot1) &&
          getRegion(plot1) === currentRegion &&
          checkPositionStringWithinBounds(plot2) &&
          getRegion(plot2) === currentRegion &&
          (!checkPositionStringWithinBounds(plot3) ||
            getRegion(plot3) !== currentRegion)
        ) {
          corners += 1;
        }
      }

      return corners;
    }

    return Array.from(positionsInRegion).reduce((acc, positionString) => {
      console.log({ positionString });
      const numExternalCorners = checkExternalCorner(positionString);
      const numInternalCorners = checkInternalCorner(positionString);
      return acc + numExternalCorners + numInternalCorners;
    }, 0);
  }

  let totalPrice = 0;
  for (let y = 0; y <= MAX_Y; y++) {
    for (let x = 0; x <= MAX_X; x++) {
      const positionString = `${x},${y}`;
      if (globalVisitedPositions.has(positionString)) {
        continue;
      }
      const regionDetail: RegionDetail = {
        label: lines[y][x],
        perimeter: 0,
        area: 0,
      };
      const localVisitedPositions = new Set<string>();
      exploreRegion(x, y, regionDetail, localVisitedPositions);

      const sides = calculateNumSides(localVisitedPositions);

      console.log({ ...regionDetail, sides });

      totalPrice += regionDetail.area * sides;
    }
  }

  return totalPrice;
}

await runSolution(day12b);

/**
 *  EEEEE
 *
 *   EEEE
 *
 *   EEEE
 *
 *  ASSUME full rectangle, find out how many rows are not full.
 *  Num gaps in rows * 4  +  original 4 (from rectangle).
 *
 *
 *  E E E E E
 *  E   E   E
 *  E E E E E
 *
 *
 */

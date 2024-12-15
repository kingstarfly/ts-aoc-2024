import { runSolution } from "../utils.ts";

type RegionDetail = {
  label: string;
  perimeter: number;
  area: number;
};
/** provide your solution as the return of this function */
export async function day12a(data: string[]) {
  // Get area and perimeter of regions.
  // A region = plants touching horizontally or vertically.
  // Group-finding. DFS increment perimeter and area as we go along.
  // Algo for perimeter: For every new plot, minus number of sides of same region. plus number of sides facing other region.
  // Maintain set of position -> region label. Space: O(n2)
  // Time: O(n2) since we visit every plot only once.

  const lines = data.filter((line) => line.length > 0);
  if (lines.length === 0) return 0;
  if (lines[0].length === 0) return 0;
  const MAX_Y = lines.length - 1;
  const MAX_X = lines[0].length - 1;

  const positionToLabel = new Map<string, string>();
  // const regionDetails = new Map<string, RegionDetail>();

  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  function exploreRegion(
    x: number,
    y: number,
    regionDetail: RegionDetail,
    positionToLabel: Map<string, string>
  ): void {
    const positionString = `${x},${y}`;
    if (positionToLabel.has(positionString)) {
      return;
    }

    // If current label is not part of the region, then we're done.
    const currentLabel = lines[y][x];
    if (regionDetail.label !== currentLabel) {
      return;
    }

    positionToLabel.set(positionString, regionDetail.label);

    // Add to the region.
    regionDetail.area++;

    // Perimeter calculation.
    regionDetail.perimeter += getIncrementalPerimeter(x, y);

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      if (withinBounds(newX, newY)) {
        exploreRegion(newX, newY, regionDetail, positionToLabel);
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

  let totalPrice = 0;
  for (let y = 0; y <= MAX_Y; y++) {
    for (let x = 0; x <= MAX_X; x++) {
      const positionString = `${x},${y}`;
      if (positionToLabel.has(positionString)) {
        continue;
      }
      const regionDetail: RegionDetail = {
        label: lines[y][x],
        perimeter: 0,
        area: 0,
      };
      exploreRegion(x, y, regionDetail, positionToLabel);
      console.log({ regionDetail });
      totalPrice += regionDetail.perimeter * regionDetail.area;
    }
  }

  return totalPrice;
}

await runSolution(day12a);

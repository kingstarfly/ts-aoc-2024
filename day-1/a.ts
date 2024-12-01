import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day1a(data: string[]) {
  // regex with named groups for better readability
  const regex = /(?<left>\d+)\s+(?<right>\d+)/;

  const result = data
    .map((line) => {
      const match = line.match(regex);
      if (match?.groups === undefined) {
        return null;
      }
      return {
        left: parseInt(match.groups.left),
        right: parseInt(match.groups.right),
      };
    })
    .filter((item) => item !== null);

  const leftList = result.map((item) => item.left).sort((a, b) => a - b);
  const rightList = result.map((item) => item.right).sort((a, b) => a - b);

  const totalDifference = leftList.reduce((acc, cur, index) => {
    return acc + Math.abs(cur - rightList[index]);
  }, 0);

  return totalDifference;
}

await runSolution(day1a);

import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day1b(data: string[]) {
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

  const leftList = result.map((item) => item.left);
  const rightList = result.map((item) => item.right);

  const freqMap = new Map<number, number>();
  for (const item of rightList) {
    freqMap.set(item, (freqMap.get(item) ?? 0) + 1);
  }

  let similarityScore = 0;
  for (const item of leftList) {
    const freq = freqMap.get(item);
    if (freq === undefined) {
      continue;
    }
    similarityScore += freq * item;
  }

  return similarityScore;
}

await runSolution(day1b);

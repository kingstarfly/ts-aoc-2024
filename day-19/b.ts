import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day19b(data: string[]) {
  const availablePatterns = new Set(data[0].split(", "));
  const desiredPatterns = data.slice(2).filter((line) => line.length > 0);
  const maxAvailablePatternLength = Array.from(availablePatterns).reduce(
    (max, pattern) => Math.max(max, pattern.length),
    0
  );

  console.log(
    availablePatterns.size,
    desiredPatterns.length,
    maxAvailablePatternLength
  );

  const cache = new Map<string, number>();

  function calcNumWaysToFormPattern(desired: string, i: number) {
    if (i === desired.length) {
      return 1;
    }

    if (i > desired.length) {
      return 0;
    }

    if (cache.has(`${desired},${i}`)) {
      return cache.get(`${desired},${i}`)!;
    }

    let numWays = 0;
    for (let j = 0; j < maxAvailablePatternLength; j++) {
      const patternToCheck = desired.slice(i, i + j + 1);
      if (availablePatterns.has(patternToCheck)) {
        numWays += calcNumWaysToFormPattern(desired, i + j + 1);
      }
    }

    if (i == 0) {
      console.log(desired, numWays);
    }

    cache.set(`${desired},${i}`, numWays);
    return numWays;
  }

  return desiredPatterns
    .map((desired) => calcNumWaysToFormPattern(desired, 0))
    .reduce((a, b) => a + b, 0);
}

await runSolution(day19b);

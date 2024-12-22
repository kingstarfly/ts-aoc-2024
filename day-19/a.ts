import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day19a(data: string[]) {
  const availablePatterns = new Set(data[0].split(", "));
  const desiredPatterns = data.slice(2).filter((line) => line.length > 0);
  const maxAvailablePatternLength = Array.from(availablePatterns).reduce(
    (max, pattern) => Math.max(max, pattern.length),
    0
  );

  function canFormPattern(available: Set<string>, desired: string, i: number) {
    if (i === desired.length) {
      return true;
    }

    if (i > desired.length) {
      return false;
    }

    for (let j = 0; j < maxAvailablePatternLength; j++) {
      const patternToCheck = desired.slice(i, i + j + 1);
      if (available.has(patternToCheck)) {
        const canForm = canFormPattern(available, desired, i + j + 1);
        if (canForm) {
          return true;
        }
      }
    }
    return false;
  }

  return desiredPatterns.filter((desired) =>
    canFormPattern(availablePatterns, desired, 0)
  ).length;
}

await runSolution(day19a);

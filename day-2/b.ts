import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day2b(data: string[]) {
  const regex = /(\d+)/g;
  const result = data
    .map((line) => {
      const match = line.match(regex);
      if (match === null) {
        throw new Error(`invalid line: ${line}`);
      }
      const levels = match.slice(0).map((n) => parseInt(n));

      for (let i = 0; i < levels.length; i++) {
        const modifiedLevels = [...levels.slice(0, i), ...levels.slice(i + 1)];
        if (checkSafeReport(modifiedLevels)) {
          return true;
        }
      }
      return false;
    })
    .reduce((numTrue, cur) => numTrue + (cur === true ? 1 : 0), 0);

  return result;
}

function checkSafeReport(levels: number[]) {
  if (levels.length < 2) {
    return false;
  }
  const minDiff = 1;
  const maxDiff = 3;
  let currentLevel = levels[0];
  let overallDirection = "neutral";
  for (let i = 1; i < levels.length; i++) {
    const diff = levels[i] - currentLevel;
    if (diff === 0) {
      return;
    }
    const direction = diff > 0 ? "up" : "down";

    if (overallDirection === "neutral") {
      overallDirection = direction;
    } else if (overallDirection !== direction) {
      return false;
    }

    const absDiff = Math.abs(diff);
    if (absDiff < minDiff || absDiff > maxDiff) {
      return false;
    }
    currentLevel = levels[i];
  }
  return true;
}

await runSolution(day2b);

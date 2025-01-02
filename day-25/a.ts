import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day25a(data: string[]) {
  // Parse input into lock heights and key heights.

  const lockHeightsArray: number[][] = [];
  const keyHeightsArray: number[][] = [];

  // Split into sections
  const sections = data.join("\n").split("\n\n");
  for (const section of sections) {
    const lines = section.split("\n");
    const charLines = lines.slice(1, 6);
    const heights: number[] = charLines.reduce((acc, line) => {
      const chars = line.split("");
      chars.forEach((char, i) => {
        if (char === "#") {
          acc[i]++;
        }
      });
      return acc;
    }, Array(5).fill(0));

    if (lines[0]?.startsWith("#")) {
      lockHeightsArray.push(heights);
    } else {
      keyHeightsArray.push(heights);
    }
  }

  // Try every combination of lock heights and key heights to see if all columns added up is <= 5.
  let countFitting = 0;
  for (let i = 0; i < lockHeightsArray.length; i++) {
    const lockHeightsAtI = lockHeightsArray[i];
    for (let j = 0; j < keyHeightsArray.length; j++) {
      const keyHeightsAtJ = keyHeightsArray[j];
      if (lockHeightsAtI === undefined || keyHeightsAtJ === undefined) {
        throw new Error("lockHeights and keyHeights must have the same length");
      }
      if (isFitting(lockHeightsAtI, keyHeightsAtJ)) {
        countFitting++;
      }
    }
  }

  return countFitting;
}

function isFitting(lockHeights: number[], keyHeights: number[]): boolean {
  for (let i = 0; i < lockHeights.length; i++) {
    const lockHeight = lockHeights[i];
    const keyHeight = keyHeights[i];
    if (lockHeight === undefined || keyHeight === undefined) {
      throw new Error("lockHeights and keyHeights must have the same length");
    }
    if (lockHeight + keyHeight > 5) {
      return false;
    }
  }
  return true;
}

await runSolution(day25a);

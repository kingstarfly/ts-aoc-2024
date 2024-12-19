import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day3b(data: string[]) {
  const mulRegex = /^mul\((\d{1,3}),(\d{1,3})\)/;
  const doRegex = /^do\(\)/;
  const dontRegex = /^don't\(\)/;

  function checkMul(startIndex: number, line: string) {
    const match = line.slice(startIndex).match(mulRegex);
    console.log({ startIndex, match });
    if (match === null) {
      return {
        success: false,
      };
    }
    const a = parseInt(match[1]);
    const b = parseInt(match[2]);
    const multipledResult = a * b;
    return {
      success: true,
      length: match[0].length,
      multipledResult,
    };
  }

  function checkDo(startIndex: number, line: string) {
    const match = line.slice(startIndex).match(doRegex);
    if (match === null) {
      return {
        success: false,
      };
    }
    return { success: true, length: match[0].length };
  }

  function checkDont(startIndex: number, line: string) {
    const match = line.slice(startIndex).match(dontRegex);
    if (match === null) {
      return {
        success: false,
      };
    }
    return { success: true, length: match[0].length };
  }

  let status: "enabled" | "disabled" = "enabled";

  const result = data
    .map((line) => {
      console.log(line);
      let currentIndex = 0;
      let lineResult = 0;

      while (currentIndex < line.length) {
        console.log({ currentIndex });
        const checkMulResult = checkMul(currentIndex, line);
        if (checkMulResult.success === true) {
          console.log({ checkMulResult });
          if (status === "enabled") {
            lineResult += checkMulResult.multipledResult;
          }
          currentIndex += checkMulResult.length;
          continue;
        }

        const checkDontResult = checkDont(currentIndex, line);
        if (checkDontResult.success === true) {
          console.log({ checkDontResult });
          status = "disabled";
          currentIndex += checkDontResult.length;
          continue;
        }

        const checkDoResult = checkDo(currentIndex, line);
        if (checkDoResult.success === true) {
          console.log({ checkDoResult });
          status = "enabled";
          currentIndex += checkDoResult.length;
          continue;
        }

        currentIndex += 1;
      }

      return lineResult;
    })
    .reduce((a, b) => a + b, 0);

  return result;
}

await runSolution(day3b);

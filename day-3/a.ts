import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day3a(data: string[]) {
  const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;
  const result = data
    .map((line) => {
      const matches = [...line.matchAll(regex)];

      if (matches.length === 0) {
        throw new Error(`invalid line: ${line}`);
      }

      return matches
        .map((match) => {
          const a = parseInt(match[1]);
          const b = parseInt(match[2]);
          return a * b;
        })
        .reduce((a, b) => a + b, 0);
    })
    .reduce((a, b) => a + b, 0);

  return result;
}

await runSolution(day3a);

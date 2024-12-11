import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day11a(data: string[]) {
  if (data.length === 0) return 0;
  const line = data[0];
  if (line.length === 0) return 0;
  const MAX_BLINKS = 25;

  // Get initial stones
  let previousStones = line.split(" ");
  let currentStones = [];

  for (let i = 0; i < MAX_BLINKS; i++) {
    currentStones = [];
    for (const stone of previousStones) {
      if (stone === "0") {
        currentStones.push("1");
        continue;
      }

      const numDigits = stone.length;
      if (numDigits % 2 === 0) {
        // Split
        const firstStone = stone.slice(0, numDigits / 2);
        const secondStone = parseInt(stone.slice(numDigits / 2)).toString();
        currentStones.push(firstStone);
        currentStones.push(secondStone);
      } else {
        currentStones.push((parseInt(stone) * 2024).toString());
      }
    }
    console.log(currentStones);
    previousStones = currentStones;
  }

  return currentStones.length;
}

await runSolution(day11a);

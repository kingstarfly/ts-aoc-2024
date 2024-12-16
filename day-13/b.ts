import { lusolve } from "mathjs";
import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day13b(data: string[]) {
  // Push button A = 3 tokens
  // Push button B = 1 token
  // Each button push <= 100
  // For each machine, find the fewest number of tokens needed to win the prize.

  const machineLines = data.reduce<string[][]>((acc, line, index) => {
    const positionInGroup = index % 4;

    // Skip every 4th line
    if (positionInGroup === 3) {
      return acc;
    }

    // If this is the first line of a group, create a new array
    if (positionInGroup === 0) {
      acc.push([line]);
    } else {
      // Add to the current group
      acc.at(-1).push(line);
    }

    return acc;
  }, []);

  const BUTTON_A_TOKENS = 3;
  const BUTTON_B_TOKENS = 1;
  const PRIZE_POSITION_EXTRA = 10_000_000_000_000;

  return machineLines
    .map((lines) => {
      const buttonRegex = /(\+\d+)/gm;
      const [xMovementForA, yMovementForA] = Array.from(
        lines[0].matchAll(buttonRegex)
      ).map((match) => match[1]);
      const [xMovementForB, yMovementForB] = Array.from(
        lines[1].matchAll(buttonRegex)
      ).map((match) => match[1]);

      const prizeRegex = /(\d+)/gm;
      const [xPrize, yPrize] = Array.from(lines[2].matchAll(prizeRegex)).map(
        (match) => match[1]
      );

      const movementsForA = {
        x: parseInt(xMovementForA),
        y: parseInt(yMovementForA),
      };

      const movementsForB = {
        x: parseInt(xMovementForB),
        y: parseInt(yMovementForB),
      };

      const prizePosition = {
        x: parseInt(xPrize) + PRIZE_POSITION_EXTRA,
        y: parseInt(yPrize) + PRIZE_POSITION_EXTRA,
      };

      return {
        movementsForA,
        movementsForB,
        prizePosition,
      };
    })
    .map((props) => {
      // Use linear algebra to solve.
      const xMatrix = [props.movementsForA.x, props.movementsForB.x];
      const yMatrix = [props.movementsForA.y, props.movementsForB.y];

      const solution = lusolve(
        [xMatrix, yMatrix],
        [props.prizePosition.x, props.prizePosition.y]
      );

      const tokensA = solution[0][0] as number;
      const tokensB = solution[1][0] as number;

      // Check that both are whole numbers
      if (
        Math.abs(tokensA - Math.round(tokensA)) > 0.001 ||
        Math.abs(tokensB - Math.round(tokensB)) > 0.001
      ) {
        return -1;
      }

      return tokensA * BUTTON_A_TOKENS + tokensB * BUTTON_B_TOKENS;
    })
    .reduce((acc, cur) => {
      if (cur === -1) return acc;
      return acc + cur;
    }, 0);
}

await runSolution(day13b);

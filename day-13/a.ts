import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day13a(data: string[]) {
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

  const MAX_PER_BUTTON_PUSHES = 100;
  const BUTTON_A_TOKENS = 3;
  const BUTTON_B_TOKENS = 1;
  const UNREACHABLE_TOKENS = 999;

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
        x: parseInt(xPrize),
        y: parseInt(yPrize),
      };

      return {
        movementsForA,
        movementsForB,
        prizePosition,
      };
    })
    .map((props) => {
      const prevResults: Map<number, Map<number, number>> = new Map();

      function getMinTokens(
        prizePosition: {
          x: number;
          y: number;
        },
        movementsA: {
          x: number;
          y: number;
        },
        buttonAPushes: number,
        movementsB: {
          x: number;
          y: number;
        },
        buttonBPushes: number
      ): number {
        const currentPosition = {
          x: buttonAPushes * movementsA.x + buttonBPushes * movementsB.x,
          y: buttonAPushes * movementsA.y + buttonBPushes * movementsB.y,
        };
        const tokensUsed =
          BUTTON_A_TOKENS * buttonAPushes + BUTTON_B_TOKENS * buttonBPushes;

        if (
          currentPosition.x === prizePosition.x &&
          currentPosition.y === prizePosition.y
        ) {
          return tokensUsed;
        }

        if (
          buttonAPushes > MAX_PER_BUTTON_PUSHES ||
          buttonBPushes > MAX_PER_BUTTON_PUSHES
        ) {
          return UNREACHABLE_TOKENS;
        }

        const savedResult = prevResults.get(buttonAPushes)?.get(buttonBPushes);
        // Check if we have calculated this function before.
        if (savedResult !== undefined) {
          console.debug(
            `[cached] ${buttonAPushes}, ${buttonBPushes} = ${savedResult}`
          );
          return savedResult;
        }

        // Try pressing button A
        const tokensA = getMinTokens(
          prizePosition,
          movementsA,
          buttonAPushes + 1,
          movementsB,
          buttonBPushes
        );

        // Try pressing button B
        const tokensB = getMinTokens(
          prizePosition,
          movementsA,
          buttonAPushes,
          movementsB,
          buttonBPushes + 1
        );

        const minTokens = Math.min(tokensA, tokensB);

        // Memoise the result.
        if (!prevResults.has(buttonAPushes)) {
          prevResults.set(buttonAPushes, new Map());
        }

        const prevResultsForButtonA = prevResults.get(buttonAPushes);
        prevResultsForButtonA.set(buttonBPushes, minTokens);

        // console.debug(`[${buttonAPushes}, ${buttonBPushes}] = ${minTokens}`);
        return minTokens;
      }

      const minTokens = getMinTokens(
        props.prizePosition,
        props.movementsForA,
        0,
        props.movementsForB,
        0
      );

      if (minTokens === UNREACHABLE_TOKENS) {
        return 0;
      }
      console.log(minTokens);
      return minTokens;
    })
    .reduce((acc, cur) => acc + cur, 0);
}

await runSolution(day13a);

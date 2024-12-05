import { runSolution } from "../utils.ts";

type Coords = {
  x: number;
  y: number;
};

/** provide your solution as the return of this function */
export async function day4a(data: string[]) {
  // For every leter, check all directions to see if XMAS can be formed.
  // This will cover all edge cases, and there is no risk of double counting.
  if (data.length === 0) {
    return 0;
  }
  const ROWS = data.length;
  const COLS = data[0].length;
  const XMAS = "XMAS";

  function getXmasCount(args: {
    current: Coords;
    direction: Coords;
    index: number;
  }) {
    if (args.index === XMAS.length) {
      return 1;
    }

    if (
      args.current.y >= ROWS ||
      args.current.x >= COLS ||
      args.current.y < 0 ||
      args.current.x < 0
    ) {
      return 0;
    }

    // console.log(args, data[args.current.y][args.current.x]);

    if (data[args.current.y][args.current.x] !== XMAS[args.index]) {
      return 0;
    }

    return getXmasCount({
      current: {
        y: args.current.y + args.direction.y,
        x: args.current.x + args.direction.x,
      },
      direction: args.direction,
      index: args.index + 1,
    });
  }

  let totalCount = 0;
  const yChoices = [-1, 0, 1];
  const xChoices = [-1, 0, 1];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      for (const yChoice of yChoices) {
        for (const xChoice of xChoices) {
          if (yChoice === 0 && xChoice === 0) {
            continue;
          }
          const count = getXmasCount({
            current: { x: c, y: r },
            direction: { x: xChoice, y: yChoice },
            index: 0,
          });
          totalCount += count;
        }
      }
    }
  }

  return totalCount;
}

await runSolution(day4a);

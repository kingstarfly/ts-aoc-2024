import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day14a(data: string[]) {
  const lines = data.filter((line) => line.startsWith("p="));
  const xLength = 101;
  const yLength = 103;
  const secondsPassed = 100;

  function getTeleportedValue(value: number, range: number) {
    let finalValue = value;
    while (finalValue < 0) {
      finalValue += range;
    }

    while (finalValue >= range) {
      finalValue -= range;
    }

    return finalValue;
  }

  return lines
    .map((line) => {
      console.log(line);
      const regex = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/;
      const [x, y, vx, vy] = line.match(regex).slice(1);

      return {
        x: parseInt(x),
        y: parseInt(y),
        vx: parseInt(vx),
        vy: parseInt(vy),
      };
    })
    .map(({ x, y, vx, vy }) => {
      const rawFinalX = x + vx * secondsPassed;
      const rawFinalY = y + vy * secondsPassed;

      const finalX = getTeleportedValue(rawFinalX, xLength);
      const finalY = getTeleportedValue(rawFinalY, yLength);

      console.log({ finalX, finalY });
      return {
        x: finalX,
        y: finalY,
      };
    })
    .reduce(
      (acc, cur) => {
        if (cur.x === (xLength - 1) / 2 || cur.y === (yLength - 1) / 2) {
          return acc;
        }

        // Determine which quadrant.
        const isLeft = cur.x <= (xLength - 1) / 2;
        const isTop = cur.y <= (yLength - 1) / 2;

        if (isLeft && isTop) {
          acc[0]++;
        } else if (!isLeft && isTop) {
          acc[1]++;
        } else if (isLeft && !isTop) {
          acc[2]++;
        } else {
          acc[3]++;
        }
        return acc;
      },
      [0, 0, 0, 0] as number[]
    )
    .reduce((acc, cur) => acc * cur, 1);
}

await runSolution(day14a);

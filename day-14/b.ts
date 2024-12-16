import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day14b(data: string[]) {
  const lines = data.filter((line) => line.startsWith("p="));

  const xLength = 101;
  const yLength = 103;

  function simulate(secondsPassed: number, printAscii: boolean) {
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

    const positions = lines
      .map((line) => {
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

        return {
          x: finalX,
          y: finalY,
        };
      });

    // Consider how many points are directly horizontally adjacent as the heuristic.
    let adjacentScore = 0;

    const positionsSet = new Set(positions.map(({ x, y }) => `${x},${y}`));
    for (const position of positions) {
      // Consider right direction
      let tempX = position.x + 1;
      while (positionsSet.has(`${tempX},${position.y}`)) {
        adjacentScore++;
        positionsSet.delete(`${tempX},${position.y}`);
        tempX++;
      }

      // Consider left direction
      tempX = position.x - 1;
      while (positionsSet.has(`${tempX},${position.y}`)) {
        adjacentScore++;
        positionsSet.delete(`${tempX},${position.y}`);
        tempX--;
      }
    }
    console.log({ adjacentScore, secondsPassed });

    if (printAscii === false) {
      return adjacentScore;
    }

    // Print ascii
    const freqMap = new Map<string, number>();
    for (const position of positions) {
      const key = `${position.x},${position.y}`;
      if (freqMap.has(key)) {
        freqMap.set(key, freqMap.get(key)! + 1);
      } else {
        freqMap.set(key, 1);
      }
    }

    console.log(`${secondsPassed}`.padStart(50, "=").padEnd(101, "="));
    for (let x = 0; x < xLength; x++) {
      for (let y = 0; y < yLength; y++) {
        const key = `${x},${y}`;
        if (freqMap.has(key)) {
          process.stdout.write("#");
        } else {
          process.stdout.write(" ");
        }
      }
      console.log("");
    }
  }

  let bestAdjacentScore = 0;
  let bestSecondsPassed = 0;
  for (let i = 0; i < 10_000; i++) {
    const score = simulate(i, false);
    if (score > bestAdjacentScore) {
      bestAdjacentScore = score;
      bestSecondsPassed = i;
    }
  }

  simulate(bestSecondsPassed, true);
}

await runSolution(day14b);

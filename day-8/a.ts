import { runSolution } from "../utils.ts";

type Position = {
  x: number;
  y: number;
};
/** provide your solution as the return of this function */
export async function day8a(data: string[]) {
  const lines = data.filter((line) => line.length > 0);
  if (lines.length === 0) {
    return 0;
  }

  const MAX_Y = lines.length - 1;
  const MAX_X = lines[0].length - 1;

  function isPositionWithinMap(position: Position) {
    return (
      position.x >= 0 &&
      position.x <= MAX_X &&
      position.y >= 0 &&
      position.y <= MAX_Y
    );
  }

  // First find every antenna and their coordinates.
  const antennaFrequencyToPosition = new Map<string, Position[]>();

  for (let y = 0; y <= MAX_Y; y++) {
    for (let x = 0; x <= MAX_X; x++) {
      const char = lines[y][x];
      if (char === ".") {
        continue;
      }
      // Assume if not ".", then it's an antenna.
      if (!antennaFrequencyToPosition.has(char)) {
        antennaFrequencyToPosition.set(char, []);
      }
      antennaFrequencyToPosition.get(char).push({ x, y });
    }
  }

  // Store unique positions as string representation - "x,y".
  const uniqueAntinodePositions = new Set<string>();

  // For every pair of antennas with same frequency, determine the two antinode positions (within bounds of map).
  for (const [, positions] of antennaFrequencyToPosition.entries()) {
    for (let i = 0; i < positions.length; i++) {
      const positionA = positions[i];
      for (let j = i + 1; j < positions.length; j++) {
        const positionB = positions[j];

        // Get the two antinode positions.
        const vectorFromAToB: Position = {
          x: positionB.x - positionA.x,
          y: positionB.y - positionA.y,
        };
        // From B + vector
        const antinode1: Position = {
          x: positionB.x + vectorFromAToB.x,
          y: positionB.y + vectorFromAToB.y,
        };
        // From A - vector
        const antinode2: Position = {
          x: positionA.x - vectorFromAToB.x,
          y: positionA.y - vectorFromAToB.y,
        };

        console.log({
          positionA,
          positionB,
          vectorFromAToB,
          antinode1,
          antinode2,
        });

        // Check if they are within bounds of map.
        if (isPositionWithinMap(antinode1)) {
          uniqueAntinodePositions.add(`${antinode1.x},${antinode1.y}`);
        }
        if (isPositionWithinMap(antinode2)) {
          uniqueAntinodePositions.add(`${antinode2.x},${antinode2.y}`);
        }
      }
    }
  }

  console.log(uniqueAntinodePositions);
  return uniqueAntinodePositions.size;
}

await runSolution(day8a);

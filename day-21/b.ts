import { Deque } from "@datastructures-js/deque";
import { runSolution } from "../utils.ts";
import { cartesianProduct } from "./cartesianProduct.ts";

/** provide your solution as the return of this function */
export async function day21b(data: string[]) {
  // getShortestMoves function that takes in a sequence of characters (can be from either keypad), the keypad to use, and returns all optimal moves like "<A^A>^^AvvvA". From the perspective of a numpad.
  // Run the above function 3 times as the problem instructs.

  const numKeypad = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    ["", "0", "A"],
  ];

  const directionKeypad = [
    ["", "^", "A"],
    ["<", "v", ">"],
  ];

  // Creat a Map to map char to position.
  const numCharToPositionMap = new Map<string, [number, number]>();
  const directionCharToPositionMap = new Map<string, [number, number]>();

  // Create a Map to map a vector to the moves needed.
  const numVectorToMovesMap = new Map<string, string[]>();
  const directionVectorToMovesMap = new Map<string, string[]>();

  function populateVectorMap(
    keypad: string[][],
    charToPositionMap: Map<string, [number, number]>,
    vectorToMovesMap: Map<string, string[]>
  ) {
    // First get a map of char -> x,y position.
    // Then for a char and some other char, that's a vector and we use BFS to generate all possible moves.
    for (let y = 0; y < keypad.length; y++) {
      for (let x = 0; x < keypad[y].length; x++) {
        const char = keypad[y][x];
        if (char === "") {
          continue;
        }
        charToPositionMap.set(char, [x, y]);
      }
    }

    for (const [char1, [x1, y1]] of charToPositionMap) {
      for (const [char2] of charToPositionMap) {
        if (char1 === char2) {
          // We just need to press "A".
          vectorToMovesMap.set(`${char1},${char2}`, ["A"]);
          continue;
        }
        // Queue stores [[nextX, nextY], currentMoves]
        const queue = new Deque<[[number, number], string]>();
        queue.pushBack([[x1, y1], ""]);
        const vistedPositions = new Set<string>();

        // We only want moves that are the shortest. So we can reject early if the intermediate moves are already longer than an accepted move.
        let shortestMovesLength = Number.MAX_SAFE_INTEGER;
        const possibleMoves: string[] = [];

        while (queue.size() > 0) {
          const [[currentX, currentY], currentMoves] = queue.popFront();

          const currentChar = keypad[currentY][currentX];

          if (currentChar === char2) {
            possibleMoves.push(currentMoves + "A");
            shortestMovesLength = Math.min(
              shortestMovesLength,
              currentMoves.length
            );
          }

          const directions: [[number, number], string][] = [
            [[0, 1], "v"],
            [[1, 0], ">"],
            [[0, -1], "^"],
            [[-1, 0], "<"],
          ];

          for (const [[dx, dy], move] of directions) {
            const nextX = currentX + dx;
            const nextY = currentY + dy;
            const nextMoves = currentMoves + move;

            if (
              nextY < 0 ||
              nextY >= keypad.length ||
              nextX < 0 ||
              nextX >= keypad[0].length
            ) {
              continue;
            }
            if (keypad[nextY][nextX] === "") {
              continue;
            }

            if (nextMoves.length > shortestMovesLength) {
              continue;
            }

            if (vistedPositions.has(`${nextX},${nextY},${nextMoves}`)) {
              continue;
            }
            vistedPositions.add(`${nextX},${nextY},${nextMoves}`);

            queue.pushBack([[nextX, nextY], nextMoves]);
          }
        }

        vectorToMovesMap.set(`${char1},${char2}`, possibleMoves);
      }
    }
  }

  populateVectorMap(numKeypad, numCharToPositionMap, numVectorToMovesMap);
  populateVectorMap(
    directionKeypad,
    directionCharToPositionMap,
    directionVectorToMovesMap
  );

  const memo = new Map<string, number>();

  function getShortestMoveLengthOnDirectionNumpadForVector(
    vector: string,
    layer: number
  ): number {
    if (layer === 1) {
      return directionVectorToMovesMap.get(vector)[0].length;
    }

    const memoKey = `${vector},${layer}`;
    if (memo.has(memoKey)) {
      return memo.get(memoKey);
    }

    // Get moves for the vector
    const possibleMoves = directionVectorToMovesMap.get(vector);

    let prevChar = "A";
    const vectorsPerMove = possibleMoves.map((move) => {
      const vectors: string[] = [];
      for (const char of move) {
        const vector = `${prevChar},${char}`;
        vectors.push(vector);
        prevChar = char;
      }
      return vectors;
    });

    const resultantMoveLength = vectorsPerMove.map((vectors) =>
      vectors
        .map((vector) => {
          const moveLength = getShortestMoveLengthOnDirectionNumpadForVector(
            vector,
            layer - 1
          );
          return moveLength;
        })
        .reduce((acc, length) => acc + length, 0)
    );

    const shortest = Math.min(...resultantMoveLength);

    memo.set(memoKey, shortest);

    return shortest;
  }

  function getShortestMoves(parentMoves: string) {
    let currentChar = "A";
    const vectors: string[] = [];
    for (const move of parentMoves) {
      const vector = `${currentChar},${move}`;
      vectors.push(vector);
      currentChar = move;
    }

    const allMovesPerVector = vectors.map((vector) => {
      return numVectorToMovesMap.get(vector);
    });

    return cartesianProduct(allMovesPerVector).map((moves) =>
      moves.reduce((acc, move) => acc + move, "")
    );
  }

  let score = 0;
  for (const line of data) {
    const numericPart = Number(line.match(/(\d+)/).at(1));

    const shortestMoves1 = getShortestMoves(line);

    // Replace this for loop with a dfs function so we don't need to call in a loop.
    const layer = 25;

    let shortestLength = Number.MAX_SAFE_INTEGER;
    for (const move of shortestMoves1) {
      let currentChar = "A";
      const vectors = [];
      for (const char of move) {
        const vector = `${currentChar},${char}`;
        vectors.push(vector);
        currentChar = char;
      }

      const possibleShortestLength = vectors
        .map((vector) =>
          getShortestMoveLengthOnDirectionNumpadForVector(vector, layer)
        )
        .reduce((acc, length) => acc + length, 0);

      shortestLength = Math.min(shortestLength, possibleShortestLength);
    }

    console.log({ numericPart, shortestLength });
    score += numericPart * shortestLength;
  }

  return score;
}

await runSolution(day21b);

// 3118168 is too low

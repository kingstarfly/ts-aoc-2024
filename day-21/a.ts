import { Deque } from "@datastructures-js/deque";
import { runSolution } from "../utils.ts";
import { cartesianProduct } from "./cartesianProduct.ts";

/** provide your solution as the return of this function */
export async function day21a(data: string[]) {
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

  function getShortestMoves(
    parentMoves: string,
    vectorMap: Map<string, string[]>
  ) {
    let currentChar = "A";
    const vectors: string[] = [];
    for (const move of parentMoves) {
      const vector = `${currentChar},${move}`;
      vectors.push(vector);
      currentChar = move;
    }

    const allMovesPerVector = vectors.map((vector) => vectorMap.get(vector));

    const allCombinedMoves = cartesianProduct(allMovesPerVector).map((moves) =>
      moves.reduce((acc, move) => acc + move, "")
    );

    return allCombinedMoves;
  }

  let score = 0;
  for (const line of data) {
    const numericPart = Number(line.match(/(\d+)/).at(1));

    const shortestMoves1 = getShortestMoves(line, numVectorToMovesMap);

    let currentShortestMoves = shortestMoves1;
    for (let i = 0; i < 2; i++) {
      const nextShortestMoves: string[] = [];
      let shortestMoveLength = Number.MAX_SAFE_INTEGER;
      for (const move of currentShortestMoves) {
        const shortestMoves = getShortestMoves(move, directionVectorToMovesMap);
        shortestMoveLength = Math.min(
          shortestMoveLength,
          shortestMoves[0].length
        );
        nextShortestMoves.push(...shortestMoves);
      }

      currentShortestMoves = nextShortestMoves.filter(
        (move) => move.length === shortestMoveLength
      );
    }

    const shortestLength = currentShortestMoves[0].length;

    console.log({ numericPart, shortestLength });

    score += numericPart * shortestLength;
  }

  return score;
}

await runSolution(day21a);

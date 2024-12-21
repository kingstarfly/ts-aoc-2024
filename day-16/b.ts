import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import { runSolution } from "../utils.ts";

const DIRECTIONS = ["N", "S", "E", "W"] as const;
type Direction = "N" | "S" | "E" | "W";
type PriorityQueueNode = {
  state: State;
  score: number;
};
type State = {
  x: number;
  y: number;
  direction: Direction;
};

/** provide your solution as the return of this function */
export async function day16b(data: string[]) {
  // State: (x, y, direction) maps to a Score.

  const MAX_Y = data.length - 1;
  const MAX_X = data[0].length - 1;

  // string = `${x},${y},${direction}`
  const bestScores: Map<string, number> = new Map();

  // string = `${x},${y},${direction}`
  const prevStatesMap: Map<string, State[]> = new Map();

  function stateToString(state: State) {
    return `${state.x},${state.y},${state.direction}`;
  }

  const queue = new MinPriorityQueue<PriorityQueueNode>((node) => node.score);
  const visited = new Set<string>();

  // Find the S.
  let firstNode: PriorityQueueNode = undefined;
  let endPosition: { x: number; y: number } | undefined = undefined;

  for (let y = 0; y <= MAX_Y; y++) {
    for (let x = 0; x <= MAX_X; x++) {
      if (data[y][x] === "S") {
        const initialState: State = { x, y, direction: "E" };
        firstNode = {
          state: initialState,
          score: 0,
        };
        bestScores.set(stateToString(initialState), 0);
      }

      if (data[y][x] === "E") {
        endPosition = { x, y };
      }
    }
  }

  queue.enqueue(firstNode);
  let bestScore = Infinity;

  while (queue.size() > 0) {
    const currentNode = queue.dequeue();
    visited.add(stateToString(currentNode.state));
    console.log(currentNode.state);
    if (data[currentNode.state.y][currentNode.state.x] === "E") {
      bestScore = Math.min(bestScore, currentNode.score);
      continue;
    }

    // Add all possible paths to the queue.
    const directions = {
      N: [0, -1],
      E: [1, 0],
      S: [0, 1],
      W: [-1, 0],
    };

    const currentDirectionIndex = Object.keys(directions).indexOf(
      currentNode.state.direction
    );

    const possibleDirectionIndexes = [
      currentDirectionIndex - 1,
      currentDirectionIndex,
      currentDirectionIndex + 1,
    ].map((index) => (index > 3 ? index - 4 : index < 0 ? index + 4 : index));

    for (const directionIndex of possibleDirectionIndexes) {
      const [direction, offset] = Object.entries(directions)[
        directionIndex
      ] as [Direction, number[]];

      const nextX = currentNode.state.x + offset[0];
      const nextY = currentNode.state.y + offset[1];
      const nextState: State = {
        x: nextX,
        y: nextY,
        direction: direction,
      };

      if (visited.has(stateToString(nextState))) {
        continue;
      }

      if (nextX < 0 || nextX > MAX_X || nextY < 0 || nextY > MAX_Y) {
        continue;
      }

      if (data[nextY][nextX] === "#") {
        continue;
      }

      const currentBestScoreForNextPosition =
        bestScores.get(stateToString(nextState)) ?? Infinity;

      const nextScoreForNextPosition =
        direction === currentNode.state.direction
          ? currentNode.score + 1
          : currentNode.score + 1001;

      queue.enqueue({
        state: nextState,
        score: nextScoreForNextPosition,
      });

      // Update prevPositions.
      if (currentBestScoreForNextPosition === nextScoreForNextPosition) {
        const stateString = stateToString(nextState);
        if (!prevStatesMap.has(stateString)) {
          prevStatesMap.set(stateString, []);
        }
        prevStatesMap.get(stateString)!.push({ ...currentNode.state });
      } else if (currentBestScoreForNextPosition > nextScoreForNextPosition) {
        bestScores.set(stateToString(nextState), nextScoreForNextPosition);
        prevStatesMap.set(stateToString(nextState), [{ ...currentNode.state }]);
      }
    }

    // console.log({ bestScores });
    // console.log(prevStatesMap);
  }

  const returnQueue: State[] = DIRECTIONS.map((direction) => ({
    ...endPosition,
    direction,
  }));
  const optimalTiles: Set<string> = new Set();
  const visitedStates = new Set<string>();

  console.log({ bestScore });

  while (returnQueue.length > 0) {
    const currentState = returnQueue.pop();
    // console.log({ currentState });
    const score = bestScores.get(stateToString(currentState)) ?? Infinity;
    if (score > bestScore) {
      continue;
    }

    if (visitedStates.has(stateToString(currentState))) {
      continue;
    }
    visitedStates.add(stateToString(currentState));
    optimalTiles.add(`${currentState.x},${currentState.y}`);

    const prevStates = prevStatesMap.get(stateToString(currentState)) ?? [];

    returnQueue.push(...(prevStates ?? []));
  }

  function plotState(optimalTiles: Set<string>, data: string[]) {
    const MAX_Y = data.length - 1;
    const MAX_X = data[0].length - 1;
    for (let y = 0; y <= MAX_Y; y++) {
      for (let x = 0; x <= MAX_X; x++) {
        const positionString = `${x},${y}`;
        if (optimalTiles.has(positionString)) {
          process.stdout.write("O");
        } else {
          process.stdout.write(data[y][x]);
        }
      }
      process.stdout.write("\n");
    }
    console.log("");
  }

  // plotState(optimalTiles, data);
  // console.log(optimalTiles);
  return optimalTiles.size;
}

await runSolution(day16b);

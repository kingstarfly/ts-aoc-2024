import { Deque } from "@datastructures-js/deque";
import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day22b(data: string[]) {
  // map each set of 4 price changes to sum of prices at that time.
  // But you must do for all buyers.
  // o(2000 * n) where n is the number of buyers.

  function stepOne(x: number) {
    const product = x << 6;
    const xor = product ^ x;
    const modulo = xor & 0xffffff;
    return modulo;
  }

  function stepTwo(x: number) {
    const product = x >> 5;
    const xor = product ^ x;
    const modulo = xor & 0xffffff;
    return modulo;
  }

  function stepThree(x: number) {
    const product = x << 11;
    const xor = product ^ x;
    const modulo = xor & 0xffffff;
    return modulo;
  }

  const changesToTotalPrice = new Map<string, number>();

  function run(x: number) {
    let result = x;
    result = stepOne(result);
    result = stepTwo(result);
    result = stepThree(result);

    return result;
  }

  function getPriceFromSecretNumber(x: number) {
    return Number(x.toString().split("").pop());
  }

  function generateFinalSecretNumber(x: number) {
    const ITERATIONS = 2000;
    const prevPrices = new Deque([getPriceFromSecretNumber(x)]);
    const seenChangesStrings = new Set<string>();

    for (let i = 0; i < ITERATIONS; i++) {
      const result = run(x);
      x = result;

      const newPrice = getPriceFromSecretNumber(result);

      prevPrices.pushBack(getPriceFromSecretNumber(newPrice));
      if (prevPrices.size() > 5) {
        prevPrices.popFront();
      }

      if (prevPrices.size() === 5) {
        const prevNumbersArray = prevPrices.toArray();
        const changesString = prevNumbersArray
          .slice(1)
          .map((n, i) => `${n - prevNumbersArray[i]}`)
          .join(",");

        if (!seenChangesStrings.has(changesString)) {
          changesToTotalPrice.set(
            changesString,
            (changesToTotalPrice.get(changesString) ?? 0) + newPrice
          );
          seenChangesStrings.add(changesString);
        }
      }
    }
    return x;
  }

  for (const line of data) {
    const x = parseInt(line);
    generateFinalSecretNumber(x);
  }

  // console.log({ changesToTotalPrice });
  // console.log(changesToTotalPrice.get("-2,1,-1,3"));

  // Scan through the map to find the greatest value.
  return Array.from(changesToTotalPrice.values()).reduce((a, b) =>
    Math.max(a, b)
  );
}

await runSolution(day22b);

import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day22a(data: string[]) {
  // Mix -> XOR
  // Prune -> modulo 2^24 -> & 0xFFFFFF

  // Step 1: * 2^6 (left shift by 5) then XOR
  // Step 2: / 2^5 (right shift by 5) then XOR then modulo 2^24
  // Step 3: Multiply by 2^11 then mix then prune.

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

  function run(x: number) {
    let result = x;
    result = stepOne(result);
    result = stepTwo(result);
    result = stepThree(result);
    return result;
  }

  function generateFinalSecretNumber(x: number) {
    const ITERATIONS = 2000;
    for (let i = 0; i < ITERATIONS; i++) {
      x = run(x);
    }
    return x;
  }

  let sum = 0;
  for (const line of data) {
    const x = parseInt(line);
    const finalSecretNumber = generateFinalSecretNumber(x);
    console.log(finalSecretNumber);
    sum += finalSecretNumber;
  }
  return sum;
}

await runSolution(day22a);

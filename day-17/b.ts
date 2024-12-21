import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day17a(data: string[]) {
  // combo operands
  // 0 - 3 = 0 - 3
  // 4 = A, 5 = B, 6 = C, 7 = FAILURE

  // instruction opcodes
  // 0 -> A = A >> 3
  // 1 -> B = B ^ Operand
  // 2 -> B = B & 0b111
  // 3 -> If A = 0, skip. IF not, set instruction pointer to literal operand - 2?
  // 4 -> B= B ^ C-> Store in B. Read operand but ignore it.
  // 5 -> combo operand modulo 8 -> Output (save in array?)
  // 6 -> B = A >> 3
  // 7 -> C = A >> 3

  // Part 2:
  // We know that for the program to have ended, the value of A must have been 0.
  // The only instruction that affects A in 1 iteration of the program before the JNZ, is "0 3",
  // which is the instruction that sets A = A >> 3. So, we can infer possible values for A for that
  // particular iteration of the program. A can be 0-7.
  // For these values of A, we try each of them and see if the program output is desired.
  // Keep only the values of A that result in the desired output.
  // Use these values of A the narrow down the possible values of A in the previous iteration.
  // Do so until we obtain desired program output.
  // If we have multiple possible values of A at the end, choose the smallest one.
  const [initialB, initialC] = data
    .slice(1, 3)
    .map((line) => BigInt(line.match(/(\d+)/)[1]));
  const instructions = data[4].slice("Program: ".length).split(",");

  function getOutput(A: bigint, B: bigint, C: bigint) {
    const outputs: bigint[] = [];
    let instructionPointer = 0;

    function getComboOperandValue(comboOperand: number) {
      if (comboOperand <= 3) {
        return BigInt(comboOperand);
      }

      if (comboOperand === 4) {
        return A;
      }

      if (comboOperand === 5) {
        return B;
      }

      if (comboOperand === 6) {
        return C;
      }

      throw new Error(`Invalid combo operand: ${comboOperand}`);
    }

    while (instructionPointer < instructions.length) {
      const opcode = instructions[instructionPointer];
      const operand = instructions[instructionPointer + 1];

      switch (opcode) {
        case "0": {
          const operandValue = getComboOperandValue(Number(operand));
          A = A >> operandValue;
          break;
        }
        case "6": {
          const operandValue = getComboOperandValue(Number(operand));
          B = A >> operandValue;
          break;
        }
        case "7": {
          const operandValue = getComboOperandValue(Number(operand));
          C = A >> operandValue;
          break;
        }
        case "1": {
          const operandValue = BigInt(operand);
          B = B ^ operandValue;
          break;
        }

        case "2": {
          const operandValue = getComboOperandValue(Number(operand));
          B = operandValue & BigInt(0b111);
          break;
        }

        case "3": {
          if (A === BigInt(0)) break;
          const operandValue = Number(operand);
          instructionPointer = operandValue - 2;
          break;
        }

        case "4": {
          B = B ^ C;
          break;
        }

        case "5": {
          const operandValue = getComboOperandValue(Number(operand));
          outputs.push(operandValue & BigInt(0b111));
          break;
        }
      }

      instructionPointer += 2;
    }

    return outputs;
  }

  const desiredOutput = instructions;

  // Get valid A values given a desired output.
  function getValidAValues(
    desiredOutput: string[],
    previousAValues: bigint[] = []
  ) {
    const validAValues = [];
    for (const prevAValue of previousAValues) {
      // For each prev A value, try adding +1 ... +7 to it to try.
      for (let i = 0; i < 8; i++) {
        const possibleA = (prevAValue << BigInt(3)) + BigInt(i);
        const output = getOutput(possibleA, initialB, initialC);
        if (output.join(",") === desiredOutput.join(",")) {
          validAValues.push(possibleA);
        }
      }
    }

    return validAValues;
  }

  // return getOutput(BigInt(2030), initialB, initialC);

  let validAValues: bigint[] = [BigInt(0)];
  for (let i = 0; i < desiredOutput.length; i++) {
    console.log("Valid vals for A:", validAValues);
    const desiredOutputForI = desiredOutput.slice(
      desiredOutput.length - 1 - i,
      desiredOutput.length
    );
    console.log("Desired output for i:", desiredOutputForI);

    validAValues = getValidAValues(
      desiredOutput.slice(desiredOutput.length - 1 - i, desiredOutput.length),
      validAValues
    );
  }

  return validAValues.sort().at(0);
}

await runSolution(day17a);

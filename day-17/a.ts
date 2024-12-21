import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day17a(data: string[]) {
  // combo operands
  // 0 - 3 = 0 - 3
  // 4 = A, 5 = B, 6 = C, 7 = FAILURE

  // instruction opcodes
  // 0 -> division: Divide A by 2^(combo operand) -> Truncate to integer, store in A.
  // 1 -> bitwise XOR of B with literal operand -> Store in B.
  // 2 -> combo operand modulo 8 -> Store in B.
  // 3 -> If A = 0, skip. IF not, set instruction pointer to literal operand - 2?
  // 4 -> bitwise XOR of B with C -> Store in B. Read operand but ignore it.
  // 5 -> combo operand modulo 8 -> Output (save in array?)
  // 6 -> division: Divide A by 2^(combo operand) -> Truncate to integer, store in B.
  // 7 -> division: Divide A by 2^(combo operand) -> Truncate to integer, store in C.
  const [A, B, C] = data
    .slice(0, 3)
    .map((line) => Number(line.match(/(\d+)/)[1]));

  const instructions = data[4].slice("program: ".length).split(",");

  function getOutput(A: number, B: number, C: number) {
    const outputs: number[] = [];
    let instructionPointer = 0;

    function getComboOperandValue(comboOperand: number) {
      if (comboOperand <= 3) {
        return comboOperand;
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
          const operandValue = Number(operand);
          B = B ^ operandValue;
          break;
        }

        case "2": {
          const operandValue = getComboOperandValue(Number(operand));
          B = operandValue & 0b111;
          break;
        }

        case "3": {
          if (A === 0) break;
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
          outputs.push(operandValue & 0b111);
          break;
        }
      }

      instructionPointer += 2;
    }

    return outputs.join(",");
  }

  return getOutput(A, B, C);
}

await runSolution(day17a);

import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day7b(data: string[]) {
  const lines = data.filter((line) => line.length > 0);

  function calculate(
    i: number,
    currentValue: number,
    operator: "+" | "*" | "||",
    operands: number[],
    testValue: number
  ) {
    if (i === operands.length) {
      // console.log({ currentValue, testValue });
      return currentValue === testValue;
    }

    let nextValue = undefined;
    if (operator === "+") {
      nextValue = currentValue + operands[i];
    } else if (operator === "*") {
      nextValue = currentValue * operands[i];
    } else if (operator === "||") {
      nextValue = parseInt(`${currentValue}${operands[i]}`);
    } else {
      return false;
    }

    return (
      calculate(i + 1, nextValue, "+", operands, testValue) ||
      calculate(i + 1, nextValue, "*", operands, testValue) ||
      calculate(i + 1, nextValue, "||", operands, testValue)
    );
  }

  return lines
    .map((line) => {
      const [firstPart, secondPart] = line.split(":");
      const operands = secondPart
        .trim()
        .split(" ")
        .map((x) => parseInt(x));
      const testValue = parseInt(firstPart);
      return {
        operands,
        testValue,
      };
    })
    .filter(({ operands, testValue }) => {
      return (
        calculate(1, operands[0], "+", operands, testValue) ||
        calculate(1, operands[0], "*", operands, testValue) ||
        calculate(1, operands[0], "||", operands, testValue)
      );
    })
    .reduce((totalSum, data) => totalSum + data.testValue, 0);
}

await runSolution(day7b);

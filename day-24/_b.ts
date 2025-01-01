import { runSolution } from "../utils.ts";


/** provide your solution as the return of this function */
export async function day24b(data: string[]) {
  /*
  Full adder
  - zn = xn ^ yn ^ cn-1
  - cn = (xn & yn) | ((xn ^ yn) & cn-1)
  Carry Equation: cn = (xn AND yn) OR (cn-1 AND (xn XOR yn))
  Broken into two parts:
  (xn AND yn): Generates a carry if both inputs are 1
  (cn-1 AND (xn XOR yn)): If both inputs are not 1, then propagates carry-in if any one of the inputs is 1.

  How the data is probably created:
  1. xn ^ yn is the only XOR and this result is used to calculate zn and cn.
  2. xn & yn is the first AND.
  3. Any AND after must be used in the intermediate carry calculation.
  4. Any OR must be used in the final carry calculation.
  
  Approach to question: Rename the wires to more sensible names with the right indices. 
  Then group wires into blocks of same index to visually inspect the wrong wires.

  Renaming plan:
  First pass:
  1. Rename xn ^ yn or yn ^ xn to XORn
  2. Rename xn & yn to ANDn

  Second pass:
  3. Rename the intermediate carry output to INTERMEDIATE_CARRYn
  
  Third pass:
  4. Rename the final carry output to FINAL_CARRYn
  
  */

  const wireMappings = new Map<string, string>();

  function halfAdderPass(data: string[]): string[] {
    const renamedData = data.map((line) => {
      const match = line.match(/(x|y)(\d+) (XOR|AND) (x|y)(\d+) -> (.{3})/);
      if (match !== null) {
        const digit = match[2];
        const originalOutputWire = match[6];
        if (originalOutputWire === undefined) {
          throw new Error("Original output wire is undefined");
        }

        const newOutputWire = `${match[3]}${digit}`;

        wireMappings.set(originalOutputWire, newOutputWire);

        const newLine = line.replace(
          ` -> ${originalOutputWire}`,
          ` -> ${newOutputWire}`
        );
        return newLine;
      }

      return line;
    });

    // Perform another pass to ensure all the renamed wires are renamed.
    const renamedData2 = renamedData.map((line) => {
      for (const [originalWire, newWire] of wireMappings) {
        if (line.includes(originalWire)) {
          return line.replace(originalWire, newWire);
        }
      }

      return line;
    });

    return renamedData2;
  }

  function carryIntermediatePass(data: string[]): string[] {
    // Replace the output of any remaining AND that doesn't equate to ANDn with CARRY_INTn
    const renamedData = data.map((line) => {
      const match = line.match(
        /(XOR\d+ AND (.{3})|(.{3}) AND XOR\d+) -> (.{3})/
      );
      if (match !== null) {
        const xorMatch = match[0].match(/XOR(\d+)/) ?? [];
        if (xorMatch === null) {
          return line;
        }
        const digit = xorMatch[1];

        const originalOutputWire = match[4];
        if (originalOutputWire === undefined) {
          throw new Error("Original output wire is undefined");
        }

        const newOutputWire = `CARRY_INT${digit}`;

        wireMappings.set(originalOutputWire, newOutputWire);

        const newLine = line.replace(
          ` -> ${originalOutputWire}`,
          ` -> ${newOutputWire}`
        );
        return newLine;
      }
      return line;
    });

    // Perform another pass to ensure all the renamed wires are renamed.
    const renamedData2 = renamedData.map((line) => {
      for (const [originalWire, newWire] of wireMappings) {
        if (line.includes(originalWire)) {
          return line.replace(originalWire, newWire);
        }
      }

      return line;
    });

    return renamedData2;
  }

  function carryPass(data: string[]): string[] {
    // Replace the output of any OR 

  const halfAdderPassData = halfAdderPass(data);
  const carryIntermediatePassData = carryIntermediatePass(halfAdderPassData);

  console.log(carryIntermediatePassData.join("\n"));
}

await runSolution(day24b);

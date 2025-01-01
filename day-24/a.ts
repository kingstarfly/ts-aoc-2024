import { Deque } from "@datastructures-js/deque";
import { runSolution } from "../utils.ts";

type Computation = {
  inputWire1: string;
  operator: "AND" | "OR" | "XOR";
  inputWire2: string;
  outputWire: string;
};

/** provide your solution as the return of this function */
export async function day24a(data: string[]) {
  // Queue to maintain which gate/output wire can be computed next.
  // Each wire has input values must resolve first (requiredWires).
  // Build a graph of dependencies. Once dependencies are resolved, add this write to the queue to process.
  // Once the wire is processed, strike off this dependency any wires that depend on this wire. -> Maintain wireToWaitingWires map.

  const computationToRequiredWires = new Map<Computation, Set<string>>();

  const wireToComputations = new Map<string, Set<Computation>>();
  const wireToValueMap = new Map<string, number>();

  const computationsToProcess = new Deque<Computation>();

  function cleanupWire(wire: string) {
    // Check all next computations that need to be processed.
    const relatedComputations = wireToComputations.get(wire) ?? new Set();
    for (const computation of relatedComputations) {
      // Remove this current wire from the set of wires that are blocking the computation.
      const requiredWires = computationToRequiredWires.get(computation);
      if (requiredWires === undefined) {
        throw new Error(
          "Blocking wires should not be undefined: " + computation
        );
      }

      requiredWires.delete(wire);
      wireToComputations.delete(wire);

      if (requiredWires.size === 0) {
        // We can add this computation to the queue.
        computationsToProcess.pushBack(computation);
      }
    }
  }

  function initialize(lines: string[]) {
    const spaceLine = lines.indexOf("");

    const relations = lines.slice(spaceLine + 1);

    for (const line of relations) {
      const [expression, wire] = line.split(" -> ");
      if (expression === undefined || wire === undefined) {
        throw new Error("Invalid line: " + line);
      }
      const [wire1, operator, wire2] = expression.split(" ");
      if (
        wire1 === undefined ||
        operator === undefined ||
        wire2 === undefined
      ) {
        throw new Error("Invalid line: " + line);
      }
      if (operator !== "AND" && operator !== "OR" && operator !== "XOR") {
        throw new Error("Invalid operator: " + operator);
      }

      const computation: Computation = {
        inputWire1: wire1,
        operator,
        inputWire2: wire2,
        outputWire: wire,
      };
      const wire1Computations = wireToComputations.get(wire1) ?? new Set();
      wire1Computations.add(computation);
      wireToComputations.set(wire1, wire1Computations);

      const wire2Computations = wireToComputations.get(wire2) ?? new Set();
      wire2Computations.add(computation);
      wireToComputations.set(wire2, wire2Computations);

      computationToRequiredWires.set(computation, new Set([wire1, wire2]));
    }

    const wireInputs = lines.slice(0, spaceLine);
    for (const line of wireInputs) {
      const [wire, value] = line.split(": ");
      if (wire === undefined || value === undefined) {
        throw new Error("Invalid line: " + line);
      }
      const bitValue = Number(value);
      if (bitValue !== 0 && bitValue !== 1) {
        throw new Error("Invalid value: " + value);
      }
      wireToValueMap.set(wire, bitValue);

      cleanupWire(wire);
    }
  }

  initialize(data);

  console.log({ computationToRequiredWires });
  console.log({ wireToComputations });
  console.log({ wireToValueMap });
  console.log(computationsToProcess.toArray());

  while (computationsToProcess.size() > 0) {
    const computation = computationsToProcess.popFront();
    const { inputWire1, operator, inputWire2, outputWire } = computation;

    const wire1Value = wireToValueMap.get(inputWire1);
    const wire2Value = wireToValueMap.get(inputWire2);
    if (wire1Value === undefined || wire2Value === undefined) {
      throw new Error("Wire value should not be undefined: " + computation);
    }

    // Carry out the computation and save the value to output wire.
    switch (operator) {
      case "AND":
        wireToValueMap.set(outputWire, wire1Value & wire2Value);
        break;
      case "OR":
        wireToValueMap.set(outputWire, wire1Value | wire2Value);
        break;
      case "XOR":
        wireToValueMap.set(outputWire, wire1Value ^ wire2Value);
        break;
    }

    cleanupWire(outputWire);
  }

  // Collate all z__ wires
  const finalBits = Array.from(wireToValueMap.entries())
    .map(([wire, value]) => {
      if (wire.startsWith("z")) {
        return { wire, value };
      }
      return undefined;
    })
    .filter((x) => x !== undefined)
    .sort((a, b) => -a.wire.localeCompare(b.wire));

  return finalBits.map((x) => x.value).reduce((acc, x) => acc * 2 + x, 0);
}

await runSolution(day24a);

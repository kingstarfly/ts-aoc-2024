import _ from "lodash";
import { runSolution } from "../utils.ts";

type Gate = {
  input1: string;
  operator: string;
  input2: string;
  output: string;
};

type Alias = {
  input1Pattern: string;
  operatorPattern: string;
  input2Pattern: string;
  aliasPattern: string;
};

type InputValues = {
  [key: string]: number; // e.g., { x00: 1, y01: 0, ... }
};

type RegexMatchResult = {
  matched: boolean;
  nValue?: string; // Optional, only present if matched
};

const aliasMap = new Map<string, string>();

function parseInput(lines: string[]): {
  gates: Gate[];
  inputValues: InputValues;
} {
  const gates: Gate[] = [];
  const inputValues: InputValues = {};

  for (const line of lines) {
    if (line === "") continue;
    if (line.includes(":")) {
      // Input value line (e.g., "x00: 1")
      const [key, value] = line.split(":").map((s) => s.trim());
      if (key === undefined || value === undefined) {
        throw new Error("Invalid input line: " + line);
      }
      inputValues[key] = parseInt(value, 10);
    } else {
      // Gate description line (e.g., "x36 AND y36 -> rpc")
      const [inputs, output] = line.split("->").map((s) => s.trim());
      if (inputs === undefined || output === undefined) {
        throw new Error("Invalid gate line");
      }
      const [input1, operator, input2] = inputs.split(" ").map((s) => s.trim());
      if (
        input1 === undefined ||
        operator === undefined ||
        input2 === undefined
      ) {
        throw new Error("Invalid gate line");
      }
      gates.push({ input1, operator, input2, output });
    }
  }

  return { gates, inputValues };
}

function applyAliases(gates: Gate[], aliases: Alias[]): Gate[] {
  // First Pass: Build the wire-to-alias map
  for (const gate of gates) {
    for (const alias of aliases) {
      const { input1Pattern, operatorPattern, input2Pattern, aliasPattern } =
        alias;

      const input1Match = matchPattern(gate.input1, input1Pattern);
      const operatorMatch = gate.operator === operatorPattern;
      const input2Match = matchPattern(gate.input2, input2Pattern);

      if (input1Match.matched && operatorMatch && input2Match.matched) {
        const nValue = input1Match.nValue || input2Match.nValue;
        if (nValue === undefined) throw new Error("Captured number not found");

        const newOutput = aliasPattern.replace(
          /\(N\)/g,
          nValue.padStart(2, "0")
        );
        if (gate.output === newOutput || gate.output.startsWith("z")) continue; // No change, skip
        aliasMap.set(gate.output, newOutput);
      }
    }
  }

  // Second Pass: Update all gate inputs and outputs using the map
  const aliasedGates = gates.map((gate) => ({
    ...gate,
    input1: aliasMap.get(gate.input1) || gate.input1,
    input2: aliasMap.get(gate.input2) || gate.input2,
    output: aliasMap.get(gate.output) || gate.output,
  }));

  return aliasedGates;
}

// Helper function to match patterns like "x(N)" or "CARRY(N-1)"
function matchPattern(input: string, pattern: string): RegexMatchResult {
  const regexStr = pattern
    .replace(/\(N-1\)/g, "(\\d+)") // Capture N-1 as a number
    .replace(/\(N\)/g, "(\\d+)"); // Capture N as a number
  const regex = new RegExp(`^${regexStr}$`);
  const match = input.match(regex);

  if (match && match[1]) {
    if (pattern.includes("(N-1)")) {
      return { matched: true, nValue: (parseInt(match[1]) + 1).toString() };
    } else {
      return { matched: true, nValue: match[1] };
    }
  } else {
    return { matched: false };
  }
}

function applyAliasesInStages(gates: Gate[]): Gate[] {
  const groupedGates = groupGatesByIndex(gates);

  // Stage 1: Alias x(N) AND/XOR y(N)
  let aliasedGates = applyAliases(gates, [
    {
      input1Pattern: "x(N)",
      operatorPattern: "AND",
      input2Pattern: "y(N)",
      aliasPattern: "AND(N)",
    },
    {
      input1Pattern: "y(N)",
      operatorPattern: "AND",
      input2Pattern: "x(N)",
      aliasPattern: "AND(N)",
    },
    {
      input1Pattern: "x(N)",
      operatorPattern: "XOR",
      input2Pattern: "y(N)",
      aliasPattern: "XOR(N)",
    },
    {
      input1Pattern: "y(N)",
      operatorPattern: "XOR",
      input2Pattern: "x(N)",
      aliasPattern: "XOR(N)",
    },
  ]);

  // Stage 2: Replace AND00 with CARRY00
  aliasedGates = aliasedGates.map((gate) =>
    gate.output === "AND00"
      ? { ...gate, output: "CARRY00" }
      : gate.input1 === "AND00"
      ? { ...gate, input1: "CARRY00" }
      : gate.input2 === "AND00"
      ? { ...gate, input2: "CARRY00" }
      : gate
  );

  // Stage 3: Recursively apply CARRY_INTERMEDIATE and CARRY aliases
  let changed = true;
  while (changed) {
    const beforeCount = countCarryWires(aliasedGates);
    aliasedGates = applyAliases(aliasedGates, [
      {
        input1Pattern: "XOR(N)",
        operatorPattern: "AND",
        input2Pattern: "CARRY(N-1)",
        aliasPattern: "CARRY_INTERMEDIATE(N)",
      },
      {
        input1Pattern: "CARRY(N-1)",
        operatorPattern: "AND",
        input2Pattern: "XOR(N)",
        aliasPattern: "CARRY_INTERMEDIATE(N)",
      },
      {
        input1Pattern: "AND(N)",
        operatorPattern: "OR",
        input2Pattern: "CARRY_INTERMEDIATE(N)",
        aliasPattern: "CARRY(N)",
      },
      {
        input1Pattern: "CARRY_INTERMEDIATE(N)",
        operatorPattern: "OR",
        input2Pattern: "AND(N)",
        aliasPattern: "CARRY(N)",
      },
    ]);
    const afterCount = countCarryWires(aliasedGates);
    changed = beforeCount !== afterCount;
  }

  return aliasedGates;
}

function groupGatesByIndex(gates: Gate[]) {
  return _.groupBy(gates, (gate) => getAverageIndex(gate));
}

function getAverageIndex(gate: Gate): number {
  const indices = [gate.input1, gate.input2, gate.output]
    .map(extractIndex)
    .filter((index) => index !== null);

  if (indices.length === 0) {
    return 0;
  }
  return indices.reduce(
    (highest, index) => Math.max(highest, index),
    -Infinity
  );
}

function extractIndex(str: string): number | null {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function countCarryWires(gates: Gate[]): number {
  let count = 0;
  for (const gate of gates) {
    if (gate.output.startsWith("CARRY")) {
      count++;
    }
  }
  return count;
}

/** provide your solution as the return of this function */
export async function day24b(data: string[]) {
  const { gates, inputValues } = parseInput(data);
  const aliasedGates = applyAliasesInStages(gates);

  const groupedGates = groupGatesByIndex(aliasedGates);

  console.log("Aliased and Sorted Gates:");
  Object.entries(groupedGates).forEach(([, gates]) => {
    gates.forEach((gate) =>
      console.log(
        `${gate.input1} ${gate.operator} ${gate.input2} -> ${gate.output}`
      )
    );
    console.log();
  });

  const swaps = "fkp,z06,ngr,z11,mfm,z31,krj,bpt";
  console.log(swaps.split(",").sort().join(","));
}
await runSolution(day24b);

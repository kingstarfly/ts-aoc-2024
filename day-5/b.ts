import { runSolution } from "../utils.ts";

// We only check in the direction of after nodes. "->".
type Node = {
  value: number;
  afterNodes: Set<Node>;
};

/** provide your solution as the return of this function */
export async function day5b(data: string[]) {
  // Build a Directed acylic graph based on rule

  // For every update, for every pair of adjacent pages, check that graph is not violated.
  // Checking that graph is not violated is O(edges).

  // Space needed for graph = O(edges)
  // Space needed for lookup table = O(vertices)
  // Runtime to build graph = O(edges)
  // Total runtime is O(updates * updateLength * edges)

  // Algorithm to fix a row: For every index, swap with left value until it not violate the graph.

  const separatingIndex = data.indexOf("");
  const ruleLines = data.slice(0, separatingIndex);
  const updateLines = data.slice(separatingIndex + 1);

  const nodeMap = new Map<number, Node>();

  for (const line of ruleLines) {
    const rule = line.split("|");
    const from = parseInt(rule[0]);
    const to = parseInt(rule[1]);

    let fromNode = nodeMap.get(from);
    if (fromNode === undefined) {
      fromNode = {
        value: from,
        afterNodes: new Set(),
      };
      nodeMap.set(from, fromNode);
    }

    let toNode = nodeMap.get(to);
    if (toNode === undefined) {
      toNode = {
        value: to,
        afterNodes: new Set(),
      };
      nodeMap.set(to, toNode);
    }

    fromNode.afterNodes.add(toNode);
  }

  // Correct when toNode after doesn't contain fromNode
  function isCorrect(
    fromNode: Node | undefined,
    toNode: Node | undefined
  ): boolean {
    if (fromNode === undefined || toNode === undefined) {
      console.log("true");
      return true;
    }
    process.stdout.write(`${fromNode?.value} -> ${toNode?.value} `);

    if (toNode.afterNodes.has(fromNode)) {
      console.log("false");

      return false;
    }

    console.log("true");
    return true;
  }

  return updateLines
    .map((line) => {
      return line.split(",").map((x) => parseInt(x));
    })
    .filter((updates) => {
      // For every pair of updates, check if violate the graph
      for (let i = 0; i < updates.length - 1; i++) {
        for (let j = i + 1; j < updates.length; j++) {
          if (!isCorrect(nodeMap.get(updates[i]), nodeMap.get(updates[j]))) {
            // We want to keep only the incorrect rows.
            return true;
          }
        }
      }
      // We want to keep only the incorrect rows.
      return false;
    })
    .map((line) => {
      console.log(line);
      // We do the row correction here and return the middle value.
      const ordering = line.map((value) => nodeMap.get(value));

      const totalLength = line.length;
      for (let i = 1; i < totalLength; i++) {
        const curNode = ordering[i];
        while (i - 1 >= 0 && !isCorrect(ordering[i - 1], curNode)) {
          console.log(
            `Swapping ${curNode?.value} with ${ordering[i - 1]?.value}`
          );
          // swap if not correct
          const temp = ordering[i - 1];
          ordering[i - 1] = ordering[i];
          ordering[i] = temp;
          i -= 1;
        }
      }

      console.log(
        "New ordering ->",
        ordering.map((x) => x?.value)
      );

      const middleIndex = (totalLength - 1) / 2;
      return ordering[middleIndex].value;
    })
    .reduce((a, b) => a + b, 0);
}

await runSolution(day5b);

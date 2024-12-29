import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day23b(data: string[]) {
  // BK algorithm to enumerate maximal cliques. Cliques are a set of vertices that are all connected to each other.
  // https://youtu.be/j_uQChgo72I?t=905

  const computerToConnectedComputers = new Map<string, Set<string>>();

  for (const line of data) {
    const [computer1, computer2] = line.split("-");
    if (computer1 === undefined || computer2 === undefined) {
      throw new Error("Invalid line: " + line);
    }

    const computer1ConnectedComputers =
      computerToConnectedComputers.get(computer1) ?? new Set();
    computer1ConnectedComputers.add(computer2);
    computerToConnectedComputers.set(computer1, computer1ConnectedComputers);

    const computer2ConnectedComputers =
      computerToConnectedComputers.get(computer2) ?? new Set();
    computer2ConnectedComputers.add(computer1);
    computerToConnectedComputers.set(computer2, computer2ConnectedComputers);
  }

  // Enumerate all maximal cliques.
  const maximalCliques = new Set<string>();
  let maximumCliqueSize = 0;

  function enumerateMaximalCliques(
    currentClique: string[],
    candidateComputers: Set<string>,
    visitedComputers: Set<string>
  ) {
    if (candidateComputers.size === 0 && visitedComputers.size === 0) {
      // We found a maximal clique.
      if (currentClique.length > maximumCliqueSize) {
        maximumCliqueSize = currentClique.length;
        maximalCliques.clear();
        const sortedClique = currentClique.sort();
        maximalCliques.add(sortedClique.join(","));
      }
      return;
    }

    for (const computer of candidateComputers.keys()) {
      const updatedClique = currentClique.concat(computer);

      const updatedCandidateComputers = candidateComputers.intersection(
        computerToConnectedComputers.get(computer) ?? new Set<string>()
      );
      const updatedVisitedComputers = visitedComputers.intersection(
        computerToConnectedComputers.get(computer) ?? new Set<string>()
      );

      enumerateMaximalCliques(
        updatedClique,
        updatedCandidateComputers,
        updatedVisitedComputers
      );
      candidateComputers.delete(computer);
      visitedComputers.add(computer);
    }
  }

  enumerateMaximalCliques(
    [],
    new Set(computerToConnectedComputers.keys()),
    new Set()
  );

  return maximalCliques.values().next().value;
}

await runSolution(day23b);

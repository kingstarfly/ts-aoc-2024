import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day23a(data: string[]) {
  // Maintain set of computer -> Connected computers (set)

  // After going through all connections, iterate through keys of map.
  // For each computer, select 2 connections to form the set of 3 and check if all are all connected + start with T.

  const computerToConnectedComputers = new Map<string, Set<string>>();

  for (const line of data) {
    const [computer1, computer2] = line.split("-");

    const computer1ConnectedComputers =
      computerToConnectedComputers.get(computer1) ?? new Set();
    computer1ConnectedComputers.add(computer2);
    computerToConnectedComputers.set(computer1, computer1ConnectedComputers);

    const computer2ConnectedComputers =
      computerToConnectedComputers.get(computer2) ?? new Set();
    computer2ConnectedComputers.add(computer1);
    computerToConnectedComputers.set(computer2, computer2ConnectedComputers);
  }

  console.log(computerToConnectedComputers);

  const validSets = new Set<string>();
  for (const [
    computer,
    connectedComputers,
  ] of computerToConnectedComputers.entries()) {
    const connectedComputersArray = Array.from(connectedComputers);

    for (let i = 0; i < connectedComputersArray.length; i++) {
      for (let j = i + 1; j < connectedComputersArray.length; j++) {
        if (
          computerToConnectedComputers
            .get(connectedComputersArray[i])
            ?.has(connectedComputersArray[j])
        ) {
          const computers = [
            computer,
            connectedComputersArray[i],
            connectedComputersArray[j],
          ];
          const computersInString = computers.sort().join(",");

          validSets.add(computersInString);
        }
      }
    }
  }

  let count = 0;

  for (const setString of validSets) {
    const computers = setString.split(",");
    if (computers.some((computer) => computer.startsWith("t"))) {
      count++;
    }
  }

  return count;
}

await runSolution(day23a);

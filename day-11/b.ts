import { runSolution } from "../utils.ts";

/** provide your solution as the return of this function */
export async function day11b(data: string[]) {
  if (data.length === 0) return 0;
  const line = data[0];
  if (line.length === 0) return 0;
  const MAX_BLINKS = 25;

  // Lots of repeated cases - we notice that stones get to 0, we will have a definite answer to it?
  // dp[stone][blinksLeft] = number of stones at the end
  const previousAnswer = {};

  function calcAndSaveAnswer(stoneText: string, blinksLeft: number) {
    if (previousAnswer[stoneText]?.[blinksLeft] !== undefined) {
      return previousAnswer[stoneText][blinksLeft];
    }

    function saveAnswer(stoneText: string, blinksLeft: number, answer: number) {
      if (!previousAnswer[stoneText]) {
        previousAnswer[stoneText] = {};
      }
      previousAnswer[stoneText][blinksLeft] = answer;
    }

    if (blinksLeft === 0) {
      const answer = 1;
      saveAnswer(stoneText, blinksLeft, answer);
      return answer;
    }

    // Handle each case
    if (stoneText === "0") {
      return calcAndSaveAnswer("1", blinksLeft - 1);
    }

    if (stoneText.length % 2 === 0) {
      const firstStone = stoneText.slice(0, stoneText.length / 2);
      const secondStone = parseInt(
        stoneText.slice(stoneText.length / 2)
      ).toString();
      const answer =
        calcAndSaveAnswer(firstStone, blinksLeft - 1) +
        calcAndSaveAnswer(secondStone, blinksLeft - 1);
      saveAnswer(stoneText, blinksLeft, answer);
      return answer;
    }

    const answer = calcAndSaveAnswer(
      (parseInt(stoneText) * 2024).toString(),
      blinksLeft - 1
    );
    saveAnswer(stoneText, blinksLeft, answer);
    return answer;
  }

  return line.split(" ").reduce((acc, stoneText) => {
    const count = calcAndSaveAnswer(stoneText, MAX_BLINKS);
    console.log({ previousAnswer });
    return acc + count;
  }, 0);
}

await runSolution(day11b);

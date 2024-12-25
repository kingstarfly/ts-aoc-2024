// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cartesianProduct = <T extends any[][]>(
  a: [...T]
): Array<{ [K in keyof T]: T[K][number] }> =>
  a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

export function createStringArray(start: number, end: number): string[] {
  let arr: string[] = [];
  for (let i = start; i <= end; i++) {
    arr.push(i.toString());
  }
  return arr;
}

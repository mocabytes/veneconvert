export function parseNumber(input: string): number {
  if (typeof input !== "string") {
    return NaN;
  }
  const normalized = input.trim().replace(/,/g, ".");
  return parseFloat(normalized);
}

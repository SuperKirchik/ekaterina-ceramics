import type { CSSProperties } from "react";

function longestWordLength(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .reduce((max, word) => Math.max(max, word.length), 0);
}

export function fitClamp(
  value: string,
  minRem: number,
  vw: number,
  maxRem: number,
  comfortableLength = 12,
  minScale = 0.52,
): CSSProperties {
  const longest = longestWordLength(value);
  const scale =
    longest > comfortableLength
      ? Math.max(minScale, comfortableLength / longest)
      : 1;

  return {
    fontSize: `clamp(${(minRem * scale).toFixed(3)}rem, ${(vw * scale).toFixed(3)}vw, ${(maxRem * scale).toFixed(3)}rem)`,
  };
}

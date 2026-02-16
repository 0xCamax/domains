import { Quantity } from "../types/primitives.ts";

export function toQuantity(value: bigint | number): Quantity {
  const v = typeof value === "number" ? BigInt(value) : value;
  if (v < 0n) throw new RangeError("Negative quantity");
  return `0x${v.toString(16)}`;
}
export type Hex = `0x${string}`;
export type Address = Hex & { readonly __address: unique symbol };
export type Wei = bigint;
export type Gas = bigint;
export type Nonce = bigint;
export type ChainId = bigint;

export type Hash = Hex & { readonly __hash: unique symbol };
export type Quantity = Hex; // hex-encoded bigint
export type BlockTag = "latest" | "pending" | "earliest" | Hex;
// Safe in JS number
export type uint8   = bigint;
export type uint16  = bigint;
export type uint24  = bigint;
export type uint32  = bigint;
export type uint40  = bigint;
export type uint48  = bigint;

// Must be bigint
export type uint56  = bigint;
export type uint64  = bigint;
export type uint72  = bigint;
export type uint80  = bigint;
export type uint88  = bigint;
export type uint96  = bigint;
export type uint104 = bigint;
export type uint112 = bigint;
export type uint120 = bigint;
export type uint128 = bigint;
export type uint136 = bigint;
export type uint144 = bigint;
export type uint152 = bigint;
export type uint160 = bigint;
export type uint168 = bigint;
export type uint176 = bigint;
export type uint184 = bigint;
export type uint192 = bigint;
export type uint200 = bigint;
export type uint208 = bigint;
export type uint216 = bigint;
export type uint224 = bigint;
export type uint232 = bigint;
export type uint240 = bigint;
export type uint248 = bigint;
export type uint256 = bigint;

// Safe in JS number
export type int8   = bigint;
export type int16  = bigint;
export type int24  = bigint;
export type int32  = bigint;
export type int40  = bigint;
export type int48  = bigint;

// Must be bigint
export type int56  = bigint;
export type int64  = bigint;
export type int72  = bigint;
export type int80  = bigint;
export type int88  = bigint;
export type int96  = bigint;
export type int104 = bigint;
export type int112 = bigint;
export type int120 = bigint;
export type int128 = bigint;
export type int136 = bigint;
export type int144 = bigint;
export type int152 = bigint;
export type int160 = bigint;
export type int168 = bigint;
export type int176 = bigint;
export type int184 = bigint;
export type int192 = bigint;
export type int200 = bigint;
export type int208 = bigint;
export type int216 = bigint;
export type int224 = bigint;
export type int232 = bigint;
export type int240 = bigint;
export type int248 = bigint;
export type int256 = bigint;


// ---------- Hex ----------

export function isHex(value: string): value is Hex {
  return /^0x[0-9a-fA-F]*$/.test(value);
}

export function assertHex(value: string): asserts value is Hex {
  if (!isHex(value)) {
    throw new TypeError("Invalid hex string");
  }
}

// ---------- Quantity ----------

export function toQuantity(value: bigint | number): Quantity {
  const v = typeof value === "number" ? BigInt(value) : value;

  if (v < 0n) {
    throw new RangeError("Negative quantity not allowed");
  }

  return `0x${v.toString(16)}` as Quantity;
}

export function fromQuantity(hex: Quantity): bigint {
  assertHex(hex);
  return BigInt(hex);
}

// ---------- Address ----------

export function toAddress(hex: string): Address {
  assertHex(hex);

  if (hex.length !== 42) {
    throw new RangeError("Invalid address length");
  }

  return hex as Address;
}

// ---------- Domain Casts ----------

export function toWei(value: bigint | number): Wei {
  const v = typeof value === "number" ? BigInt(value) : value;
  if (v < 0n) throw new RangeError("Negative Wei");
  return v as Wei;
}

export function toGas(value: bigint | number): Gas {
  const v = typeof value === "number" ? BigInt(value) : value;
  if (v < 0n) throw new RangeError("Negative Gas");
  return v as Gas;
}

export function toNonce(value: bigint | number): Nonce {
  const v = typeof value === "number" ? BigInt(value) : value;
  if (v < 0n) throw new RangeError("Negative Nonce");
  return v as Nonce;
}

export function toChainId(value: bigint | number): ChainId {
  const v = typeof value === "number" ? BigInt(value) : value;
  if (v <= 0n) throw new RangeError("Invalid ChainId");
  return v as ChainId;
}

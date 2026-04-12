type Brand<K, T> = K & { __brand: T };

export type Hex = `0x${string}`;
export type Address = Hex & { readonly __address: unique symbol };

export type Wei = Brand<bigint, "wei">;
export type Gas = Brand<bigint, "gas">;
export type Nonce = Brand<bigint, "nonce">;
export type ChainId = Brand<bigint, "chainId">;

export type Hash = Hex & { readonly __hash: unique symbol };
export type Quantity = Hex; // hex-encoded bigint
// Safe in JS number
export type uint8 = bigint;
export type uint16 = bigint;
export type uint24 = bigint;
export type uint32 = bigint;
export type uint40 = bigint;
export type uint48 = bigint;

// Must be bigint
export type uint56 = bigint;
export type uint64 = bigint;
export type uint72 = bigint;
export type uint80 = bigint;
export type uint88 = bigint;
export type uint96 = bigint;
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
export type int8 = bigint;
export type int16 = bigint;
export type int24 = bigint;
export type int32 = bigint;
export type int40 = bigint;
export type int48 = bigint;

// Must be bigint
export type int56 = bigint;
export type int64 = bigint;
export type int72 = bigint;
export type int80 = bigint;
export type int88 = bigint;
export type int96 = bigint;
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

// Log
export interface RpcLog {
  address: Address;
  topics: Hash[];
  data: Hex;
  blockNumber: Quantity | null;
  transactionHash: Hash | null;
  transactionIndex: Quantity | null;
  blockHash: Hash | null;
  logIndex: Quantity | null;
  removed: boolean;
}

// Transaction
export interface RpcTransaction {
  hash: Hash;
  nonce: Quantity;
  blockHash: Hash | null;
  blockNumber: Quantity | null;
  transactionIndex: Quantity | null;
  from: Address;
  to: Address | null;
  value: Quantity;
  gas: Quantity;
  gasPrice?: Quantity;
  maxFeePerGas?: Quantity;
  maxPriorityFeePerGas?: Quantity;
  input: Hex;
  type?: Quantity;
  chainId?: Quantity;
  v: Quantity;
  r: Hex;
  s: Hex;
}

// Receipt
export interface RpcTransactionReceipt {
  transactionHash: Hash;
  transactionIndex: Quantity;
  blockHash: Hash;
  blockNumber: Quantity;
  from: Address;
  to: Address | null;
  cumulativeGasUsed: Quantity;
  gasUsed: Quantity;
  contractAddress: Address | null;
  logs: RpcLog[];
  logsBloom: Hex;
  status?: Quantity;
  root?: Hex;
  effectiveGasPrice?: Quantity;
}

// Block
export interface RpcBlock {
  number: Quantity | null;
  hash: Hash | null;
  parentHash: Hash;
  nonce: Hex | null;
  sha3Uncles: Hash;
  logsBloom: Hex | null;
  transactionsRoot: Hash;
  stateRoot: Hash;
  receiptsRoot: Hash;
  miner: Address;
  difficulty: Quantity;
  totalDifficulty?: Quantity;
  extraData: Hex;
  size: Quantity;
  gasLimit: Quantity;
  gasUsed: Quantity;
  timestamp: Quantity;
  baseFeePerGas?: Quantity;
  transactions: (Hash | RpcTransaction)[];
  uncles: Hash[];
}


export type BlockTag =
  | "latest"
  | "earliest"
  | "pending"
  | "safe"
  | "finalized";

export type BlockNumber = Hex | BlockTag;

export type SimulationContext = {
  blockNumber: BlockNumber;
  transactionIndex: number;
};

export type TransactionCall = {
  from?: Hex;
  to?: Hex | null;

  gas?: Hex;
  value?: Hex;

  input?: Hex;

  gasPrice?: Hex;

  maxFeePerGas?: Hex;
  maxPriorityFeePerGas?: Hex;

  nonce?: Hex;
  type?: Hex;
};

export type BlockOverride = {
  blockNumber?: BlockNumber;
  blockHash?: Hex;
  coinbase?: Hex;
  timestamp?: Hex;
  difficulty?: Hex;
  gasLimit?: Hex;
  baseFee?: Hex;
};

export type Bundle = {
  transactions: TransactionCall[];

  blockOverride?: BlockOverride;
};

export type StateOverride = Record<
  Hex,
  {
    balance?: Hex;
    nonce?: Hex;
    code?: Hex;

    state?: Record<Hex, Hex>;
    stateDiff?: Record<Hex, Hex>;
  }
>;
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

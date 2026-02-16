import {Address, Hex, BlockTag} from "./primitives.ts"

export interface LogFilter {
  fromBlock?: BlockTag;
  toBlock?: BlockTag;
  Address?: Address | Address[];
  topics?: (Hex | Hex[] | null)[];
}
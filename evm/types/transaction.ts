import type {
  Address,
  ChainId,
  Gas,
  Hex,
  Nonce,
  Quantity,
  Wei,
} from "./primitives.ts";
import type { CallObject } from "./callObject.ts";

import { toQuantity } from "./primitives.ts";

export enum TransactionType {
  Legacy = 0,
  EIP2930 = 1,
  EIP1559 = 2,
  EIP7702 = 4,
}

interface BaseTransaction {
  from?: Address;
  to?: Address;
  value?: Wei;
  data?: Hex;
  nonce?: Nonce;
  chainId?: ChainId;
  gasLimit?: Gas;
}

export interface LegacyTransaction extends BaseTransaction {
  type?: TransactionType.Legacy;
  gasPrice?: Wei;
}

export interface EIP2930Transaction extends BaseTransaction {
  type: TransactionType.EIP2930;
  gasPrice?: Wei;
  accessList?: AccessList;
}

export interface EIP1559Transaction extends BaseTransaction {
  type: TransactionType.EIP1559;
  maxFeePerGas?: Wei;
  maxPriorityFeePerGas?: Wei;
  accessList?: AccessList;
}

export interface EIP7702Transaction extends BaseTransaction {
  type: TransactionType.EIP7702;
  maxFeePerGas?: Wei;
  maxPriorityFeePerGas?: Wei;
  accessList?: AccessList;
  authorizationList?: AuthorizationList;
}

export interface Authorization {
  chainId: Quantity;
  address: Address;
  nonce: Quantity;
  yParity: Quantity;
  r: Quantity;
  s: Quantity;
}

export type TransactionRequest =
  | LegacyTransaction
  | EIP2930Transaction
  | EIP1559Transaction
  | EIP7702Transaction;

export type StorageKey = Hex; // 32 bytes

export interface AccessListEntry {
  address: Address;
  storageKeys: StorageKey[];
}

export type AccessList = AccessListEntry[];
export type AuthorizationList = Authorization[];

export function normalizeTransaction(
  tx: TransactionRequest,
): CallObject {
  return {
    from: tx.from,
    to: tx.to,
    data: tx.data,

    gas: tx.gasLimit !== undefined ? toQuantity(tx.gasLimit) : undefined,
    value: tx.value !== undefined ? toQuantity(tx.value) : undefined,
    nonce: tx.nonce !== undefined ? toQuantity(tx.nonce) : undefined,
    chainId: tx.chainId !== undefined ? toQuantity(tx.chainId) : undefined,

    gasPrice: "gasPrice" in tx && tx.gasPrice !== undefined
      ? toQuantity(tx.gasPrice)
      : undefined,

    maxFeePerGas: "maxFeePerGas" in tx && tx.maxFeePerGas !== undefined
      ? toQuantity(tx.maxFeePerGas)
      : undefined,

    maxPriorityFeePerGas:
      "maxPriorityFeePerGas" in tx && tx.maxPriorityFeePerGas !== undefined
        ? toQuantity(tx.maxPriorityFeePerGas)
        : undefined,

    accessList: "accessList" in tx ? tx.accessList : undefined,
    authorizationList: "authorizationList" in tx
      ? tx.authorizationList
      : undefined,
  };
}

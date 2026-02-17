import { Address, Hex, Quantity } from "./primitives.ts";
import {
  AccessList,
  AuthorizationList,
  TransactionType,
} from "./transaction.ts";
import { RpcInvalidTransactionError } from "../constants/errors.ts";

export interface CallObject {
  from?: Address;
  to?: Address;
  gas?: Quantity;
  gasPrice?: Quantity;
  value?: Quantity;
  data?: Hex;
  nonce?: Quantity;
  maxFeePerGas?: Quantity;
  maxPriorityFeePerGas?: Quantity;
  chainId?: Quantity;

  accessList?: AccessList;
  authorizationList?: AuthorizationList;
}

export function validateCallObject(tx: CallObject): void {
  const type = inferTransactionType(tx);

  if (type === 0 && (tx.maxFeePerGas || tx.maxPriorityFeePerGas)) {
    throw new RpcInvalidTransactionError(
      "Legacy tx cannot use EIP-1559 fields",
    );
  }

  if (type === 2 && tx.gasPrice) {
    throw new RpcInvalidTransactionError("EIP-1559 cannot use gasPrice");
  }

  if (
    type === 4 && (!tx.authorizationList || tx.authorizationList.length === 0)
  ) {
    throw new RpcInvalidTransactionError("EIP-7702 requires authorizationList");
  }
}

export function inferTransactionType(tx: CallObject): TransactionType {
  if (tx.authorizationList) return TransactionType.EIP7702;
  if (tx.maxFeePerGas || tx.maxPriorityFeePerGas) {
    return TransactionType.EIP1559;
  }
  if (tx.accessList) return TransactionType.EIP2930;
  return TransactionType.Legacy;
}

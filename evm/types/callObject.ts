import { Address, Hex, Quantity } from "./primitives.ts";
import { AccessList, AuthorizationList } from "./transaction.ts";

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
    throw new Error("Legacy tx cannot use EIP-1559 fields");
  }

  if (type === 2 && tx.gasPrice) {
    throw new Error("EIP-1559 cannot use gasPrice");
  }

  if (
    type === 4 && (!tx.authorizationList || tx.authorizationList.length === 0)
  ) {
    throw new Error("EIP-7702 requires authorizationList");
  }
}

export function inferTransactionType(tx: CallObject): 0 | 1 | 2 | 4 {
  if (tx.authorizationList) return 4;
  if (tx.maxFeePerGas || tx.maxPriorityFeePerGas) return 2;
  if (tx.accessList) return 1;
  return 0;
}

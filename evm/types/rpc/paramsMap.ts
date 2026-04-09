import { EvmRpcMethod } from "../../constants/methods.ts";
import { Address, BlockTag, Bundle, Hash, Hex, Quantity } from "../primitives.ts";
import { CallObject } from "../callObject.ts";
import { LogFilter } from "../logFilter.ts";

export interface RpcParamsMap {
  [EvmRpcMethod.eth_chainId]: [];
  [EvmRpcMethod.eth_blockNumber]: [];

  [EvmRpcMethod.eth_accounts]: [];

  [EvmRpcMethod.eth_getBalance]: [
    Address: Address,
    block: BlockTag,
  ];

  [EvmRpcMethod.eth_getTransactionCount]: [
    Address: Address,
    block: BlockTag,
  ];

  [EvmRpcMethod.eth_getBlockByNumber]: [
    block: BlockTag,
    hydrated: boolean,
  ];

  [EvmRpcMethod.eth_getBlockByHash]: [
    hash: Hash,
    hydrated: boolean,
  ];

  [EvmRpcMethod.eth_sendRawTransaction]: [
    rawTx: Hex,
  ];

  [EvmRpcMethod.eth_getTransactionByHash]: [
    hash: Hash,
  ];

  [EvmRpcMethod.eth_getTransactionReceipt]: [
    hash: Hash,
  ];

  [EvmRpcMethod.eth_callMany]: [
    bundle: Bundle[],
  ];

  [EvmRpcMethod.eth_call]: [
    tx: CallObject,
    block: BlockTag,
  ];

  [EvmRpcMethod.eth_estimateGas]: [
    tx: CallObject,
    block?: BlockTag,
  ];

  [EvmRpcMethod.eth_getLogs]: [
    filter: LogFilter,
  ];

  [EvmRpcMethod.eth_getCode]: [
    Address: Address,
    block: BlockTag,
  ];

  [EvmRpcMethod.eth_getStorageAt]: [
    Address: Address,
    position: Quantity,
    block: BlockTag,
  ];
}

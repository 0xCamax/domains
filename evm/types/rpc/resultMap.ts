import {
  Address,
  Hash,
  Hex,
  Quantity,
  RpcBlock,
  RpcLog,
  RpcTransaction,
  RpcTransactionReceipt,
} from "../primitives.ts";

export interface RpcResultMap {
  // --- Web3 ---
  web3_clientVersion: string;
  web3_sha3: Hex;

  // --- Net ---
  net_version: string;
  net_listening: boolean;
  net_peerCount: Quantity;

  // --- Eth basic ---
  eth_protocolVersion: string;
  eth_syncing:
    | false
    | {
      startingBlock: Quantity;
      currentBlock: Quantity;
      highestBlock: Quantity;
    };

  eth_coinbase: Address;
  eth_chainId: Quantity;
  eth_mining: boolean;
  eth_hashrate: Quantity;
  eth_gasPrice: Quantity;
  eth_accounts: Address;
  eth_blockNumber: Quantity;

  // --- Account state ---
  eth_getBalance: Quantity;
  eth_getStorageAt: Hex;
  eth_getTransactionCount: Quantity;
  eth_getCode: Hex;

  // --- Calls / execution ---
  eth_call: Hex;
  eth_estimateGas: Quantity;

  // --- Blocks ---
  eth_getBlockByHash: RpcBlock | null;
  eth_getBlockByNumber: RpcBlock | null;
  eth_getBlockTransactionCountByHash: Quantity | null;
  eth_getBlockTransactionCountByNumber: Quantity | null;

  // --- Transactions ---
  eth_getTransactionByHash: RpcTransaction | null;
  eth_getTransactionByBlockHashAndIndex: RpcTransaction | null;
  eth_getTransactionByBlockNumberAndIndex: RpcTransaction | null;
  eth_sendRawTransaction: Hash;
  eth_sendTransaction: Hash;
  eth_getTransactionReceipt: RpcTransactionReceipt | null;

  // --- Logs ---
  eth_getLogs: RpcLog[];

  // --- Uncle blocks ---
  eth_getUncleCountByBlockHash: Quantity | null;
  eth_getUncleCountByBlockNumber: Quantity | null;
  eth_getUncleByBlockHashAndIndex: RpcBlock | null;
  eth_getUncleByBlockNumberAndIndex: RpcBlock | null;

  // --- Fee market ---
  eth_feeHistory: {
    oldestBlock: Quantity;
    reward?: Quantity[][];
    baseFeePerGas: Quantity[];
    gasUsedRatio: number[];
  };

  eth_maxPriorityFeePerGas: Quantity;

  // --- Filters (legacy polling) ---
  eth_newFilter: Quantity;
  eth_newBlockFilter: Quantity;
  eth_newPendingTransactionFilter: Quantity;
  eth_uninstallFilter: boolean;
  eth_getFilterChanges: (RpcLog | Hash)[];
  eth_getFilterLogs: RpcLog[];

  // --- Debug / trace (si el nodo lo soporta) ---
  debug_traceTransaction: unknown;
  debug_traceBlockByHash: unknown;
  debug_traceBlockByNumber: unknown;

  // --- Tx pool ---
  txpool_status: {
    pending: Quantity;
    queued: Quantity;
  };

  txpool_content: unknown;
}

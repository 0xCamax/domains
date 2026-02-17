export enum EvmRpcMethod {
  // Chain
  eth_chainId = "eth_chainId",
  eth_blockNumber = "eth_blockNumber",

  // Accounts
  eth_accounts = "eth_accounts",
  eth_getBalance = "eth_getBalance",
  eth_getTransactionCount = "eth_getTransactionCount",

  // Blocks
  eth_getBlockByNumber = "eth_getBlockByNumber",
  eth_getBlockByHash = "eth_getBlockByHash",

  // Transactions
  eth_sendRawTransaction = "eth_sendRawTransaction",
  eth_getTransactionByHash = "eth_getTransactionByHash",
  eth_getTransactionReceipt = "eth_getTransactionReceipt",

  // Calls
  eth_call = "eth_call",
  eth_estimateGas = "eth_estimateGas",

  // Logs
  eth_getLogs = "eth_getLogs",

  // State
  eth_getCode = "eth_getCode",
  eth_getStorageAt = "eth_getStorageAt",
}

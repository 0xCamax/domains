import "@std/dotenv/load";
import { EvmRpcClient,  EvmRpcMethod } from "./index.ts";


const endpoint = Deno.env.get("RPC_URL")!;
const evm = new EvmRpcClient(endpoint);


async function main () {
  const block = await evm.rawRequest(EvmRpcMethod.eth_blockNumber);
  console.log(block);
}

main();

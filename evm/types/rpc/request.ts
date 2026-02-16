import { RpcParamsMap } from "./paramsMap.ts";
import { EvmRpcMethod } from "./methods.ts";

export interface JsonRpcRequest<M extends EvmRpcMethod> {
  readonly jsonrpc: "2.0";
  readonly id: number | string;
  readonly method: M;
  readonly params: RpcParamsMap[M];
}

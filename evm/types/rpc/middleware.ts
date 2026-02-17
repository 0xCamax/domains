import { EvmRpcMethod } from "../../constants/methods.ts";
import { RpcParamsMap } from "./paramsMap.ts";

export type RpcNext = () => Promise<unknown>;

export type RpcMiddleware = (
  method: EvmRpcMethod,
  next: RpcNext,
  ...params: RpcParamsMap[EvmRpcMethod]
) => Promise<unknown>;

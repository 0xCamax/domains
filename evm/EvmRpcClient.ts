import { EvmRpcMethod } from "./types/rpc/methods.ts";
import { RpcParamsMap } from "./types/rpc/paramsMap.ts";
import { JsonRpcRequest } from "./types/rpc/request.ts";
import { JsonRpcResponse } from "./types/rpc/response.ts";

export class EvmRpcClient {
  constructor(
    private readonly endpoint: string,
    private readonly fetcher: typeof fetch = fetch,
  ) {
  }

  async request<M extends EvmRpcMethod, R = unknown>(
    method: M,
    ...params: RpcParamsMap[M]
  ): Promise<R> {
    const payload: JsonRpcRequest<M> = {
      jsonrpc: "2.0",
      id: crypto.randomUUID(),
      method,
      params,
    };

    const res = await this.fetcher(this.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const data: JsonRpcResponse<R> = await res.json();

    if ("error" in data) {
      throw new Error(
        `RPC Error ${data.error.code}: ${data.error.message}`,
      );
    }

    return data.result;
  }
}

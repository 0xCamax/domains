import { EvmRpcMethod } from "./constants/methods.ts";
import { RpcParamsMap } from "./types/rpc/paramsMap.ts";
import { JsonRpcRequest } from "./types/rpc/request.ts";
import { JsonRpcResponse } from "./types/rpc/response.ts";
import {
  RpcHttpError,
  RpcInvalidJsonError,
  RpcInvalidVersionError,
  RpcProtocolError,
  RpcTimeoutError,
  RpcMiddlewareNextCalledMultipleTimesError
} from "./constants/errors.ts";
import { RpcMiddleware } from "./types/rpc/middleware.ts";
import { RpcResultMap } from "./types/rpc/resultMap.ts";

export class EvmRpcClient {
  constructor(
    private readonly endpoint: string,
    private middlewares: RpcMiddleware[] = [],
    private readonly fetcher: typeof fetch = fetch,
  ) {
  }

  request<M extends EvmRpcMethod, R = RpcResultMap[M]>(
    method: M,
    ...params: RpcParamsMap[M]
  ): Promise<R> {
    return this.execute(method, ...params);
  }

  async rawRequest<M extends EvmRpcMethod, R = unknown>(
    method: M,
    ...params: RpcParamsMap[M]
  ): Promise<R> {
    const payload: JsonRpcRequest<M> = {
      jsonrpc: "2.0",
      id: crypto.randomUUID(),
      method,
      params,
    };

    const res = await this.fetchWithTimeout({
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new RpcHttpError(res.status);
    }

    let data: JsonRpcResponse<R>;

    try {
      data = await res.json();
    } catch {
      throw new RpcInvalidJsonError();
    }

    if (data.jsonrpc !== "2.0") {
      throw new RpcInvalidVersionError();
    }

    if ("error" in data) {
      throw new RpcProtocolError(
        data.error.code,
        data.error.message,
      );
    }

    return data.result;
  }

  private async fetchWithTimeout(
    init: RequestInit,
    timeoutMs = 10000,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await this.fetcher(this.endpoint, {
        ...init,
        signal: controller.signal,
      });
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        throw new RpcTimeoutError(err);
      }

      throw new RpcHttpError(0);
    } finally {
      clearTimeout(timeout);
    }
  }

  private execute<M extends EvmRpcMethod, R = unknown>(
    method: M,
    ...params: RpcParamsMap[M]
  ): Promise<R> {
    let index = 0;

    const runner = (): Promise<R> => {
      if (index >= this.middlewares.length) {
        return this.rawRequest<M, R>(method, ...params);
      }

      const current = this.middlewares[index++];
      let called = false;

      const next = (): Promise<R> => {
        if (called) {
          throw new RpcMiddlewareNextCalledMultipleTimesError();
        }
        called = true;
        return runner();
      };

      return current(method, next, ...params) as Promise<R>;
    };

    return runner();
  }

  use(middleware: RpcMiddleware): void {
    this.middlewares.push(middleware);
  }
}

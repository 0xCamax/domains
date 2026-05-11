import { EvmRpcMethod } from "./constants/methods.ts";
import { RpcParamsMap } from "./types/rpc/paramsMap.ts";
import { JsonRpcRequest } from "./types/rpc/request.ts";
import { JsonRpcResponse } from "./types/rpc/response.ts";
import {
  RpcHttpError,
  RpcInvalidJsonError,
  RpcInvalidVersionError,
  RpcMiddlewareNextCalledMultipleTimesError,
  RpcProtocolError,
  RpcTimeoutError,
} from "./constants/errors.ts";
import { RpcMiddleware } from "./types/rpc/middleware.ts";
import { RpcResultMap } from "./types/rpc/resultMap.ts";
import { HeaderFactory } from "./types/rpc/headerFactory.ts";

/**
 * Representa una petición pendiente en el mapa de WebSockets
 */
interface PendingRequest<R> {
  resolve: (value: R) => void;
  reject: (reason: Error) => void;
  timeoutId: number;
}

export class EvmRpcClient {
  private socket: WebSocket | null = null;
  // Almacena las promesas de las peticiones enviadas por WS esperando respuesta
  private readonly pendingRequests = new Map<
    string | number,
    PendingRequest<any>
  >();

  constructor(
    private readonly endpoint: string,
    private middlewares: RpcMiddleware[] = [],
    private readonly fetcher: typeof fetch = fetch,
    private readonly headerFactory?: HeaderFactory,
  ) {}

  private get isWebSocket(): boolean {
    return this.endpoint.startsWith("ws://") ||
      this.endpoint.startsWith("wss://");
  }

  public request<M extends EvmRpcMethod, R = RpcResultMap[M]>(
    method: M,
    ...params: RpcParamsMap[M]
  ): Promise<R> {
    return this.execute(method, ...params);
  }

  public async rawRequest<M extends EvmRpcMethod, R = unknown>(
    method: M,
    ...params: RpcParamsMap[M]
  ): Promise<R> {
    const payload: JsonRpcRequest<M> = {
      jsonrpc: "2.0",
      id: crypto.randomUUID(),
      method,
      params,
    };

    if (this.isWebSocket) {
      return await this.executeWsRequest<M, R>(payload);
    }

    return await this.executeHttpRequest<M, R>(payload);
  }

  private async executeWsRequest<M extends EvmRpcMethod, R>(
    payload: JsonRpcRequest<M>,
  ): Promise<R> {
    const ws = await this.getOrCreateSocket();

    return new Promise<R>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(payload.id);
        reject(
          new RpcTimeoutError(new Error(`WS Request Timeout: ${payload.id}`)),
        );
      }, 15000);

      this.pendingRequests.set(payload.id, { resolve, reject, timeoutId });

      try {
        ws.send(JSON.stringify(payload));
      } catch (_err) {
        clearTimeout(timeoutId);
        this.pendingRequests.delete(payload.id);
        reject(new RpcProtocolError(-32603, "Failed to send WS message"));
      }
    });
  }

  private getOrCreateSocket(): Promise<WebSocket> {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return Promise.resolve(this.socket);
    }

    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.socket.onopen = null;
        this.socket.onerror = null;
        this.socket.onmessage = null;
      }

      this.socket = new WebSocket(this.endpoint);

      this.socket.onopen = () => resolve(this.socket!);

      this.socket.onerror = (_event) => {
        reject(new RpcHttpError(0));
      };

      this.socket.onmessage = (event) => {
        try {
          const response: JsonRpcResponse<unknown> = JSON.parse(event.data);
          const pending = this.pendingRequests.get(response.id);

          if (pending) {
            clearTimeout(pending.timeoutId);
            this.pendingRequests.delete(response.id);

            try {
              const validatedResult = this.parseAndValidateResponse(response);
              pending.resolve(validatedResult);
            } catch (err) {
              pending.reject(err as Error);
            }
          }
        } catch (_e) {
          // Error de parseo de JSON o respuesta inesperada
        }
      };

      this.socket.onclose = () => {
        for (const [id, pending] of this.pendingRequests.entries()) {
          clearTimeout(pending.timeoutId);
          pending.reject(
            new RpcProtocolError(-32603, "WebSocket connection closed"),
          );
          this.pendingRequests.delete(id);
        }
        this.socket = null;
      };
    });
  }

  async subscribe(
    params: "newHeads" | "logs" | "newPendingTransactions",
    callback: (data: any) => void,
  ): Promise<string> {
    if (!this.isWebSocket) {
      throw new Error(
        "Las suscripciones requieren un endpoint de WebSocket (wss://)",
      );
    }

    const subscriptionId = await this.request("eth_subscribe" as any, params);

    const socket = await this.getOrCreateSocket();

    const currentOnMessage = socket.onmessage;
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (
        data.method === "eth_subscription" &&
        data.params.subscription === subscriptionId
      ) {
        callback(data.params.result);
      } else if (currentOnMessage) {
        currentOnMessage.call(socket, event);
      }
    };

    return subscriptionId;
  }

  private async executeHttpRequest<M extends EvmRpcMethod, R>(
    payload: JsonRpcRequest<M>,
  ): Promise<R> {
    const body = JSON.stringify(payload);

    const dynamicHeaders = this.headerFactory
      ? await this.headerFactory(body)
      : {};

    const res = await this.fetchWithTimeout({
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...dynamicHeaders,
      },
      body,
    });

    const text = await res.text();

    if (!res.ok) throw new RpcHttpError(res.status);

    try {
      const data: JsonRpcResponse<R> = JSON.parse(text);
      return this.parseAndValidateResponse(data);
    } catch (err) {
      if (
        err instanceof RpcProtocolError ||
        err instanceof RpcInvalidVersionError
      ) {
        throw err;
      }

      throw new RpcInvalidJsonError();
    }
  }

  private parseAndValidateResponse<R>(data: JsonRpcResponse<R>): R {
    if (data.jsonrpc !== "2.0") {
      throw new RpcInvalidVersionError();
    }

    if ("error" in data) {
      throw new RpcProtocolError(data.error.code, data.error.message);
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
      throw new RpcHttpError(0)
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

  public use(middleware: RpcMiddleware): void {
    this.middlewares.push(middleware);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

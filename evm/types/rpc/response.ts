export interface JsonRpcSuccess<T = unknown> {
  readonly jsonrpc: "2.0";
  readonly id: number | string;
  readonly result: T;
}

export interface JsonRpcError {
  readonly jsonrpc: "2.0";
  readonly id: number | string;
  readonly error: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export type JsonRpcResponse<T = unknown> =
  | JsonRpcSuccess<T>
  | JsonRpcError;

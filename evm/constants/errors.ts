export abstract class RpcError extends Error {
  constructor(
    message: string,
    public override readonly cause?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class RpcHttpError extends RpcError {
  constructor(
    public readonly status: number,
    cause?: unknown,
  ) {
    super(`HTTP error ${status}`, cause);
  }
}

export class RpcTimeoutError extends RpcError {
  constructor(cause?: unknown) {
    super("RPC request timed out", cause);
  }
}

export class RpcProtocolError extends RpcError {
  constructor(
    public readonly code: number,
    message: string,
    cause?: unknown,
  ) {
    super(`RPC Error ${code}: ${message}`, cause);
  }
}

export class RpcInvalidJsonError extends RpcError {
  constructor(cause?: unknown) {
    super("Invalid JSON response", cause);
  }
}

export class RpcInvalidVersionError extends RpcError {
  constructor() {
    super("Invalid JSON-RPC version");
  }
}

export class RpcConcurrencyError extends RpcError {
  constructor() {
    super("Too many concurrent RPC requests");
  }
}

export class RpcMiddlewareNextCalledMultipleTimesError extends Error {

  constructor() {
    super("Middleware next() called multiple times");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class RpcInvalidTransactionError extends Error {

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

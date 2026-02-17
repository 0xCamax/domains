import { RpcConcurrencyError } from "../constants/errors.ts";
import { RpcMiddleware } from "../types/rpc/middleware.ts";

export function createConcurrencyMiddleware(
  maxConcurrent: number,
): RpcMiddleware {
  let active = 0;

  return async (_method, next, ..._params) => {
    if (active >= maxConcurrent) {
      throw new RpcConcurrencyError();
    }

    active++;

    try {
      return await next();
    } finally {
      active--;
    }
  };
}

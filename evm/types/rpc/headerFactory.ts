import { Account, hashMessage } from "viem";

export type HeaderFactory = (
  body: string,
) => Promise<Record<string, string>> | Record<string, string>;

export function createFlashbotsHeaderFactory(
  account: Account,
): HeaderFactory {
  return async (body: string) => {
    const signature = await account.signMessage({
      message: { raw: hashMessage(body) },
    });

    return {
      "X-Flashbots-Signature":
        `${account.address}:${signature}`,
    };
  };
}
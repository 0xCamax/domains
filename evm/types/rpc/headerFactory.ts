import {
  Account,
  keccak256,
  stringToHex,
} from "viem";

export type HeaderFactory = (
  body: string,
) => Promise<Record<string, string>> | Record<string, string>;

export function createFlashbotsHeaderFactory(
  account: Account,
): HeaderFactory {
  return async (body: string) => {
    const bodyHash = keccak256(
      stringToHex(body),
    );

    const signature = await account.signMessage({
      message: bodyHash,
    });

    return {
      "X-Flashbots-Signature":
        `${account.address}:${signature}`,
    };
  };
}
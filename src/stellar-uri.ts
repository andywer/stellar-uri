import { Keypair, Networks, StellarTomlResolver } from "stellar-sdk"

/**
 * The type of the Stellar URI.
 */
export enum StellarUriType {
  Transaction = "tx",
  Pay = "pay"
}

export type StellarUriOperation = StellarUriType.Pay | StellarUriType.Transaction | string

/**
 * A base class for parsing or constructing SEP-0007 style Stellar URIs.
 *
 * @see https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md
 */
export class StellarUri<Operation extends StellarUriOperation = StellarUriOperation> {
  readonly #uri: URL

  readonly callback = this.#uri.searchParams.has("callback")
    ? this.#uri.searchParams.get("callback")!.replace(/^url:/, "")
    : undefined

  constructor(uri: URL | string) {
    this.#uri = typeof uri === "string" ? new URL(uri) : uri
  }

  get(paramName: string) {
    return this.#uri.searchParams.get(paramName)
  }

  has(paramName: string) {
    return this.#uri.searchParams.has(paramName)
  }

  get operation(): Operation {
    return this.#uri.pathname as Operation
  }

  get originDomain(): string | undefined {
    if (!this.#uri.searchParams.has("origin_domain")) {
      return undefined
    }
    return this.#uri.searchParams.get("origin_domain")!
  }

  get msg(): string | undefined {
    if (!this.#uri.searchParams.has("msg")) {
      return undefined
    }
    return this.#uri.searchParams.get("msg")!
  }

  get networkPassphrase(): string | undefined {
    if (!this.#uri.searchParams.has("network_passphrase")) {
      return undefined
    }
    return this.#uri.searchParams.get("network_passphrase")!
  }

  get signature(): string | undefined {
    if (!this.#uri.searchParams.has("signature")) {
      return undefined
    }
    return this.#uri.searchParams.get("signature")!
  }

  isPublicNetwork(): boolean {
    return !this.networkPassphrase || this.networkPassphrase === Networks.PUBLIC
  }

  isTestNetwork(): boolean {
    return this.networkPassphrase === Networks.TESTNET
  }

  /** Returns a new, signed Stellar URI. This Stellar URI instance will stay unchanged */
  sign(keypair: Keypair): StellarUri<Operation> {
    const derived = new URL(this.#uri.toString())
    const payload = this.createSignaturePayload()
    const signature = keypair.sign(payload).toString('base64');
    derived.searchParams.set("signature", signature)
    return new StellarUri<Operation>(derived)
  }

  toString(): string {
    return this.#uri.toString()
  }

  async verifySignature(): Promise<boolean> {
    if (!this.originDomain && !this.signature) {
      // if there's no origin domain or signature then there's nothing to verify
      return true;
    }

    if (!this.originDomain || !this.signature) {
      // we can fail fast if neither of them are set since we can't verify without both
      return false;
    }

    try {
      const toml = await StellarTomlResolver.resolve(this.originDomain);
      const signingKey = toml.URI_REQUEST_SIGNING_KEY;

      if (!signingKey) {
        return false;
      }

      const keypair = Keypair.fromPublicKey(signingKey);
      const payload = this.createSignaturePayload();

      return keypair.verify(payload, Buffer.from(this.signature, 'base64'));
    } catch (error) {
      // if something fails we assume signature verification failed
      return false;
    }
  }

  protected createSignaturePayload(): Buffer {
    const paramsUri = this.signature
      ? this.#uri.toString().replace(`&signature=${encodeURIComponent(this.signature)}`, '')
      : this.#uri.toString();

    // https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md#request-signing
    return Buffer.concat([
      Buffer.alloc(35),
      Buffer.alloc(1, 4),
      Buffer.from('stellar.sep.7 - URI Scheme' + paramsUri)
    ]);
  }
}

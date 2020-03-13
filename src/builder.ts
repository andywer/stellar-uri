import { Asset, Memo, MemoHash, MemoID, MemoReturn, MemoText, Networks, Transaction } from "stellar-sdk"
import { Replacement, ReplacementsParser } from "./lib/replacement"
import { StellarPayUri } from "./pay-uri"
import { StellarUri } from "./stellar-uri"
import { StellarTransactionUri } from "./tx-uri"

export class StellarUriBuilder<UriType extends StellarUri> {
  #operation: UriType["operation"]
  #params: Record<string, string | undefined>

  constructor(operation: UriType["operation"], params?: Record<string, string | undefined>) {
    this.#operation = operation
    this.#params = params || {}
  }

  build(extraParams?: Record<string, string | undefined>) {
    const uri = new URL(this.#operation)
    const params: Record<string, string | undefined> = { ...this.#params, ...extraParams }

    for (const key of Object.keys(params)) {
      if (typeof params[key] !== "undefined") {
        uri.searchParams.set(key, params[key]!)
      }
    }

    return new StellarUri(uri)
  }

  get(key: string): string | undefined {
    return this.#params[key]
  }

  set(key: string, value?: string) {
    this.#params[key] = value
    return this
  }

  useNetwork(network: Networks): this {
    this.set("network_passphrase", network)
    return this
  }
}

export interface PaymentBlueprint {
  amount?: string
  asset?: Asset
  destination: string
  memo?: Memo
}

export class StellarPayUriBuilder extends StellarUriBuilder<StellarPayUri> {
  constructor(blueprint: PaymentBlueprint, params?: Record<string, string | undefined>) {
    super("pay", params)
    this.set("destination", blueprint.destination)

    if (blueprint.amount) {
      this.set("amount", blueprint.amount)
    }
    if (blueprint.asset && !blueprint.asset.isNative()) {
      this.set("asset_code", blueprint.asset.getCode())
      this.set("asset_issuer", blueprint.asset.getIssuer())
    }
    if (blueprint.memo && (blueprint.memo.type === MemoHash || blueprint.memo.type === MemoReturn)) {
      this.set("memo", (blueprint.memo.value as Buffer).toString("base64"))
      this.set("memo_type", blueprint.memo.type)
    } else if (blueprint.memo && blueprint.memo.type === MemoID) {
      this.set("memo", blueprint.memo.value as string)
      this.set("memo_type", blueprint.memo.type)
    } else if (blueprint.memo && blueprint.memo.type === MemoText) {
      this.set("memo", blueprint.memo.value as string)
      this.set("memo_type", blueprint.memo.type)
    }
  }

  build(): StellarPayUri {
    return new StellarPayUri(super.build().toString())
  }
}

export class StellarTransactionUriBuilder extends StellarUriBuilder<StellarTransactionUri> {
  #replacements: Replacement[]

  constructor(transaction: Transaction, network?: Networks, replacements?: Replacement[], params?: Record<string, string | undefined>) {
    super("tx", params)
    this.set("xdr", transaction.toEnvelope().toXDR().toString("base64"))

    if (network && network !== Networks.PUBLIC) {
      this.useNetwork(network)
    } else if (transaction.networkPassphrase) {
      this.useNetwork(transaction.networkPassphrase as Networks)
    }

    this.#replacements = replacements || []
  }

  addReplacement(replacement: Replacement) {
    this.#replacements.push(replacement)
    return this
  }

  build(): StellarTransactionUri {
    const uri = super.build({
      replace: ReplacementsParser.toString(this.#replacements)
    })
    return new StellarTransactionUri(uri.toString())
  }
}

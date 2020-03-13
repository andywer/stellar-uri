import { Asset, Memo, Operation, OperationOptions, xdr } from "stellar-sdk"
import { StellarUri } from "./stellar-uri"

function fail(message: string): never {
  throw Error(message)
}

type MemoType = "MEMO_TEXT" | "MEMO_ID" | "MEMO_HASH" | "MEMO_RETURN"

function parseMemo(memoType: MemoType, memoValue: string | null) {
  if (!memoValue) {
    return Memo.none()
  } else if (memoType === "MEMO_HASH") {
    return Memo.hash(memoValue)
  } else if (memoType === "MEMO_ID") {
    return Memo.id(memoValue)
  } else if (memoType === "MEMO_RETURN") {
    return Memo.return(memoValue)
  } else if (memoType === "MEMO_TEXT") {
    return Memo.text(memoValue)
  } else {
    throw Error(`Unexpected memo type: ${memoType}`)
  }
}

export type PaymentOptions = OperationOptions.PathPaymentStrictReceive | {
  amount?: string
}

/**
 * The pay operation represents a request to pay a specific address with a specific asset, regardless of the source asset used by the payer.
 *
 * @see https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md#operation-pay
 */
export class StellarPayUri extends StellarUri<"pay"> {
  readonly amount: string | null = this.get("amount")
  readonly asset: Asset | null = this.get("asset_code")
    ? new Asset(this.get("asset_code")!, this.get("asset_issuer")!)
    : null

  readonly destination: string = this.get("destination") || fail(`Stellar URI of type "pay" is missing the "destination" parameter`)
  readonly memo: Memo | null = this.get("memo")
    ? parseMemo(this.get("memo_type")! as MemoType, this.get("memo"))
    : null

  toPathPayment(options: Pick<OperationOptions.PathPaymentStrictReceive, "sendAsset" | "sendMax"> & { destAmount?: string }): xdr.Operation<Operation.PathPaymentStrictReceive> {
    return Operation.pathPaymentStrictReceive({
      destAmount: options?.destAmount || this.amount || fail(`No destination amount set, neither by Stellar URI nor by payment options argument.`),
      destAsset: this.asset || Asset.native(),
      destination: this.destination,
      sendAsset: options.sendAsset,
      sendMax: options.sendMax || fail(`Need to set "sendMax" property if "sendAsset" is set`)
    })
  }

  toPayment(options?: { amount?: string }): xdr.Operation<Operation.Payment> {
    return Operation.payment({
      amount: options?.amount || this.amount || fail(`No amount set, neither by Stellar URI nor by payment options argument.`),
      asset: this.asset || Asset.native(),
      destination: this.destination
    })
  }
}

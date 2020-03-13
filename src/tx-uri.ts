import { toTransaction, toTxrep } from "@stellarguard/txrep"
import { Networks, Transaction } from "stellar-sdk"
import { Replacement, ReplacementsParser } from "./lib/replacement"
import { StellarUri } from "./stellar-uri"

function fail(message: string): never {
  throw Error(message)
}

/**
 * The tx operation represents a request to sign a specific XDR Transaction.
 *
 * @see https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md#operation-tx
 */
export class StellarTransactionUri extends StellarUri<"tx"> {
  readonly xdr: string = this.get("xdr") || fail(`Missing "xdr" parameter on Stellar tx URI`)

  getReplacements(): Replacement[] {
    const replace = this.get("replace")
    return replace ? ReplacementsParser.parse(replace) : []
  }

  getTransaction(replacementValues?: Record<string, any>): Transaction {
    const network = this.isPublicNetwork()
      ? Networks.PUBLIC
      : this.networkPassphrase;

    const tx = new Transaction(this.xdr, network);

    if (replacementValues) {
      let txrep = toTxrep(tx);
      const replacementTargets = this.getReplacements();

      for (const id of Object.keys(replacementValues)) {
        const value = replacementValues[id]

        replacementTargets
          .filter(r => r.id === id)
          .forEach(({ path }) => {
            txrep += `\ntx.${path}: ${value}`;
          });
      }

      const newTx = toTransaction(txrep, network);
      return newTx
    } else {
      return tx
    }
  }
}

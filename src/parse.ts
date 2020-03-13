import { StellarPayUri } from "./pay-uri"
import { StellarUri, StellarUriType } from "./stellar-uri"
import { StellarTransactionUri } from "./tx-uri"

/**
 * Parses a SEP-0007 style URI string and returns a TransactionStellarUri or PayStellarUri, depending on the type.
 *
 * @param uri The URI string to parse.
 *
 * @throws Throws an error if the uri is not a valid SEP-0007 style URI.
 */
export function parseStellarUri(
  uri: string
): StellarUri | StellarPayUri | StellarTransactionUri {
  if (!isStellarUri(uri)) {
    throw Error('Stellar URIs must start with "web+stellar:"');
  }

  const url = new URL(uri);
  const type = url.pathname;

  switch (type) {
    case StellarUriType.Transaction:
      return new StellarTransactionUri(url);
    case StellarUriType.Pay:
      return new StellarPayUri(url);
    default:
      throw new Error(`Stellar URI type ${type} is not currently supported.`);
  }
}

/**
 * Returns true if the given URI is a SEP-0007 style URI, false otherwise.
 * Currently this only checks whether it starts with 'web+stellar:' and is a valid type.
 *
 * @param uri The URI string to check.
 */
export function isStellarUri(uri: string): boolean {
  return (
    !!uri &&
    (uri.startsWith('web+stellar:tx') || uri.startsWith('web+stellar:pay'))
  );
}

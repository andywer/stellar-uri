// tslint:disable:no-expression-statement no-object-mutation
import test from 'ava';
import { isStellarUri, parseStellarUri } from './parse';
import { StellarPayUri } from './pay-uri';
import { StellarUri } from './stellar-uri';
import { StellarTransactionUri } from './tx-uri';

test('isStellarUri(uri) returns true when it starts with web+stellar:', t => {
  const uri = 'web+stellar:tx';
  t.true(isStellarUri(uri));
});

test('isStellarUri(uri) returns false when it does not start with web+stellar:', t => {
  const uri = 'not-a-stellar-uri:tx';
  t.false(isStellarUri(uri));
});

test('parseStellarUri(uri) parses a transaction operation uri', t => {
  const uri = 'web+stellar:tx';
  t.true(parseStellarUri(uri) instanceof StellarTransactionUri);
});

test('parseStellarUri(uri) parses a pay operation uri', t => {
  const uri = 'web+stellar:pay';
  t.true(parseStellarUri(uri) instanceof StellarPayUri);
});

test('parseStellarUri(uri) parses unknown operation types, too', t => {
  const uri = 'web+stellar:fake';
  const parsed = parseStellarUri(uri);

  t.true(parsed instanceof StellarUri);
  t.is(parsed.operation, 'fake')
});

test('parseStellarUri(uri) throws an error when there is an invalid operation type', t => {
  const uri = 'web+stellar:fake';
  t.throws(() => parseStellarUri(uri));
});

test('parseStellarUri(uri) throws an error when it is not a valid stellar uri', t => {
  const uri = 'not-a-stellar-uri:tx';
  t.throws(() => parseStellarUri(uri));
});

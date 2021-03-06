# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.1.3"></a>
## [1.1.3](https://github.com/stellarguard/stellar-uri/compare/v1.1.2...v1.1.3) (2020-02-15)



<a name="1.1.2"></a>
## [1.1.2](https://github.com/stellarguard/stellar-uri/compare/v1.1.1...v1.1.2) (2020-02-10)


### Bug Fixes

* 🐛 Bump stellar-sdk to 4.0.0, txrep to 1.0.7 ([3368019](https://github.com/stellarguard/stellar-uri/commit/3368019))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/stellarguard/stellar-uri/compare/v1.1.0...v1.1.1) (2020-01-21)


### Bug Fixes

* 🐛 Allow MAX_INT to be used for payment/limit replace ([39b7204](https://github.com/stellarguard/stellar-uri/commit/39b7204)), closes [#13](https://github.com/stellarguard/stellar-uri/issues/13)



<a name="1.1.0"></a>

# [1.1.0](https://github.com/stellarguard/stellar-uri/compare/v1.0.0...v1.1.0) (2020-01-06)

### Bug Fixes

- 🐛 Change the API for replace to just be a simple object ([a4735ea](https://github.com/stellarguard/stellar-uri/commit/a4735ea))
- getTransaction uses Networks.PUBLIC if unset ([5634f1e](https://github.com/stellarguard/stellar-uri/commit/5634f1e))

### Features

- 🎸 Add `replace` method to TransactionStellarUri ([501919f](https://github.com/stellarguard/stellar-uri/commit/501919f))
- add "replace" functionality. ([10eca50](https://github.com/stellarguard/stellar-uri/commit/10eca50))
- Add a clone method for creating deep copies ([af5605e](https://github.com/stellarguard/stellar-uri/commit/af5605e))
- Add a getTransaction method to TransactionStellarUri ([5bb1f70](https://github.com/stellarguard/stellar-uri/commit/5bb1f70))

<a name="1.0.0"></a>

# [1.0.0](https://github.com/stellarguard/stellar-uri/compare/v0.2.0...v1.0.0) (2019-05-16)

### Chores

- **deps:** Upgrade stellar-sdk to 1.0.2 ([64a4383](https://github.com/stellarguard/stellar-uri/commit/64a4383))

### BREAKING CHANGES

- **deps:** Removes @types/stellar-sdk as a dependency. Instead you should rely directly on the types from stellar-sdk

<a name="0.2.0"></a>

# [0.2.0](https://github.com/stellarguard/stellar-uri/compare/v0.1.8...v0.2.0) (2018-11-08)

### Features

- Add isTestNetwork/useTestNetwork, isPublicNetwork/usePublicNetwork ([658d769](https://github.com/stellarguard/stellar-uri/commit/658d769))

<a name="0.1.8"></a>

## [0.1.8](https://github.com/stellarguard/stellar-uri/compare/v0.1.7...v0.1.8) (2018-10-29)

<a name="0.1.7"></a>

## [0.1.7](https://github.com/stellarguard/stellar-uri/compare/v0.1.6...v0.1.7) (2018-10-29)

<a name="0.1.6"></a>

## [0.1.6](https://github.com/stellarguard/stellar-uri/compare/v0.1.5...v0.1.6) (2018-10-29)

<a name="0.1.5"></a>

## [0.1.5](https://github.com/stellarguard/stellar-uri/compare/v0.1.4...v0.1.5) (2018-10-27)

### Bug Fixes

- Properly return the 'memo' field in pay operations ([e4b56c2](https://github.com/stellarguard/stellar-uri/commit/e4b56c2))

<a name="0.1.4"></a>

## [0.1.4](https://github.com/stellarguard/stellar-uri/compare/v0.1.3...v0.1.4) (2018-10-27)

### Bug Fixes

- PayStellarUri properly gets asset_code and memo ([fa37a9f](https://github.com/stellarguard/stellar-uri/commit/fa37a9f))

<a name="0.1.3"></a>

## [0.1.3](https://github.com/stellarguard/stellar-uri/compare/v0.1.2...v0.1.3) (2018-10-27)

### Bug Fixes

- Properly ignore .cache files in npmignore ([1fb3fb2](https://github.com/stellarguard/stellar-uri/commit/1fb3fb2))

<a name="0.1.2"></a>

## [0.1.2](https://github.com/stellarguard/stellar-uri/compare/v0.1.1...v0.1.2) (2018-10-27)

<a name="0.1.1"></a>

## [0.1.1](https://github.com/stellarguard/stellar-uri/compare/v0.1.0...v0.1.1) (2018-10-25)

### Bug Fixes

- Use global URL object instead of importing 'url' ([878ab42](https://github.com/stellarguard/stellar-uri/commit/878ab42))

<a name="0.1.0"></a>

# 0.1.0 (2018-10-25)

### Features

- Add methods for creating and parsing stellar URIs ([0731cc4](https://github.com/stellarguard/stellar-uri/commit/0731cc4))

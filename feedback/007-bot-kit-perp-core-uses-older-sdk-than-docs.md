# Bot kit's perp strategies resolve @somnia-chain/markets-sdk 0.31.0 while the developer docs target 0.32.1
Severity: normal
Area: docs

## Steps to reproduce
1. Open https://app.testnet.dreamdex.io/docs/developers/perps-testnet: the SDK section says it uses version 0.32.1, "the one the app runs".
2. In the bot kit (commit 25798660bbe4674a6f83a960b202852896e2fed4), open `packages/perp-core/package.json`: `"@somnia-chain/markets-sdk": "^0.31.0"`.
3. In `package-lock.json`, the entry `packages/perp-core/node_modules/@somnia-chain/markets-sdk` resolves to version 0.31.0. The root entry `node_modules/@somnia-chain/markets-sdk` is 0.30.0 (used by `packages/ec-core`, `^0.30.0`).
4. Run `npm ls @somnia-chain/markets-sdk` after `npm install`.

## Expected
The perps strategies in the kit use the same SDK version that the perps developer docs and the app use (0.32.1), or the docs state which SDK versions the kit supports.

## Actual
Three versions are in play: 0.32.1 (docs, app), 0.31.0 (kit perps strategies) and 0.30.0 (kit event-contract strategies). A developer who copies the docs' example into a project that also uses the kit can end up with different SDK behaviour from the docs, with no note about it.

## Evidence
Kit files above: `packages/perp-core/package.json`, `packages/ec-core/package.json`, `package-lock.json` (root entry 0.30.0, perp-core nested entry 0.31.0). Docs sentence: "this page uses version 0.32.1, the one the app runs".

## Environment
Docs and kit repository. Network: Somnia Tokyo testnet. Wallet address: 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C

# Developer reference gives no install command for the Markets SDK
Severity: normal
Area: docs

## Steps to reproduce
1. Open https://app.testnet.dreamdex.io/docs/developers/perps-testnet
2. Go to the "SDK Install and Setup" section (the one with `new SomniaMarkets({...})`).
3. Look for the package name and an install command.

## Expected
An install command (npm, pnpm or yarn) for `@somnia-chain/markets-sdk` at the version the page targets, plus the `viem` dependency that the order example imports (`parseUnits`).

## Actual
The page says it uses SDK version 0.32.1 ("the one the app runs") and imports from `@somnia-chain/markets-sdk`, but it never shows an install command. A new developer has to find the package name elsewhere and guess whether to pin 0.32.1. `viem` is used in the order example without being listed as a dependency.

## Evidence
Page: https://app.testnet.dreamdex.io/docs/developers/perps-testnet, section "SDK Install and Setup". No install command appears anywhere on the page.

## Environment
Docs only, read on 2026-10-22. Network: Somnia Tokyo testnet (the docs call it Hideki, chain 50383). Wallet address: 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C

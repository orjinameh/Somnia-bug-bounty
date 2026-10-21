# Developer reference gives no install command for the Markets SDK
Severity: normal
Area: docs

## Steps to reproduce
1. Open https://app.testnet.dreamdex.io/docs/developers/perps-testnet
2. Go to "SDK Install and Setup" (the section with `new SomniaMarkets({...})`).
3. Look for the package name and an install command.

## Expected
An install command (npm/pnpm/yarn) for `@somnia-chain/markets-sdk` at the version the page targets, plus the `viem` peer dependency the example imports (`parseUnits`).

## Actual
The page says it uses SDK version 0.32.1 and shows imports from `@somnia-chain/markets-sdk`, but gives no install command. A new developer has to find the package name elsewhere and guess whether to pin 0.32.1, and `viem` is used in the order example without being listed as a dependency.

## Evidence
Page URL above, section "SDK Install and Setup". No install command appears anywhere on the page.

## Environment
Docs only. Page read on 2026-10-21. Network: Somnia Tokyo testnet (docs call it Hideki, chain 50383). Wallet address: <YOUR_ADDRESS>

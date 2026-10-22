# Bot kit README quick start and Networks table point to Shannon (50312) and omit the Hideki perps network (50383)
Severity: normal
Area: docs

## Steps to reproduce
1. Clone `somnia-chain/dreamdex-bot-kit` (commit 25798660bbe4674a6f83a960b202852896e2fed4).
2. Read `README.md`: the quick start says "Start on Shannon testnet (`NETWORK=testnet`, chain `50312`)", and the "Networks" table lists only Mainnet and Shannon testnet.
3. Read `.env.example`: the `NETWORK` comment says `"testnet" (Shannon, chain 50312) or "mainnet" (chain 5031)`.
4. Read `docs/perps.md` and `packages/perp-core/src/config.ts`: the perps strategies run on Hideki (`NETWORK=hideki`, chain 50383), `mainnet` is refused, and `testnet` (Shannon) is a second perps option.

## Expected
A developer who follows the README to run a perps bot learns that `NETWORK=hideki` (chain 50383, the network the Perps Arena and this bounty use) is the one to set. The Networks table and the `NETWORK` comment in `.env.example` list it.

## Actual
The README Networks table and the first `NETWORK` comment in `.env.example` never mention `hideki` or chain 50383. `hideki` is explained only in `docs/perps.md` and further down `.env.example` (line ~130). Three names also describe the perps testnet across the docs and the bounty: "Hideki" (developer docs, chain name), "Tokyo" (explorer path, bounty page, comments in `perp-core/src/config.ts`) and "Shannon" (README). Nowhere in the README is it stated that these are different networks.

## Evidence
`README.md` quick start and "Networks" table; `.env.example` header comment; `docs/perps.md` lines 1-6; `packages/perp-core/src/config.ts` header comment ("`hideki` (the Tokyo testnet...)" and "`testnet` (Shannon)"). Developer reference chain table: chain ID 50383, "named Hideki and appears in the app as the DreamDEX region".

## Environment
Docs only. Bot kit commit above. Network: Somnia Tokyo testnet (Hideki, 50383). Wallet address: 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C

# Docs say the per-account position cap is a tenth of the open-interest cap "on most markets", but it is a tenth on only 10 of 21 markets
Severity: normal
Area: docs

## Steps to reproduce
1. Read the developer reference (https://app.testnet.dreamdex.io/docs/developers/perps-testnet), "Common pitfalls": "Each account has a position cap per market, a tenth of the market's open interest cap on most markets." and "`getMaxPerpOrderSize` reports the cap as `maxPositionSize`."
2. Read the trader docs (https://app.testnet.dreamdex.io/docs/trading/perps-testnet): "A single account is capped at a tenth of it on most markets." The market table on that page lists each market's open interest cap.
3. With `@somnia-chain/markets-sdk` 0.32.1 on the Hideki testnet, call `client.getMaxPerpOrderSize({ pool, marginBank, account: 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C, isBid: true, price })` for each of the 21 perps markets. Take `maxPositionSize`, divide by 10^baseDecimals, and divide by the open interest cap from the docs table.
   The script that does this is a small read-only file using `client.listPerpMarkets()` and `getMaxPerpOrderSize` only; no transactions are sent.

## Expected
`maxPositionSize` is about one tenth of the docs open interest cap on most markets (more than half of the 21).

## Actual
`maxPositionSize` divided by the docs open interest cap, per market (2026-10-22):
- 0.100 (a tenth): ETH, SOL, HYPE, TAO, WLD, VVV, LIT, PUMP, ZRO, 1000PEPE (10 markets)
- 0.200 (a fifth): ADA, AVAX, BNB (0.202), DOGE, LINK, NEAR, SUI, XLM, XRP (9 markets)
- 0.405: BTC-PERP (maxPositionSize 100 BTC against a cap of 246.81545 BTC)
- 1.000: ZEC-PERP (maxPositionSize 420 ZEC against a cap of 420 ZEC, so a single account may hold the whole open interest cap)

So a tenth holds on 10 of 21 markets (48%), which is not "most", and 11 markets differ, two of them by a large margin. ZEC-PERP is also the market whose paper-credit restriction is not enforced (see report 006).

## Evidence
Output of the read-only script on 2026-10-22 (SDK 0.32.1, account 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C) with the ratios above. The docs open interest caps are copied from the market table on the trader docs page (for example BTC-PERP 246.81545 BTC, ZEC-PERP 420 ZEC). The two docs sentences are quoted above.

## Environment
`@somnia-chain/markets-sdk` 0.32.1, Somnia Tokyo testnet (Hideki, chain 50383), 2026-10-22. Wallet address: 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C

# Explorer trade card shows a shortened pool address and size "0" for ZEC-PERP trades (base decimals 8), but a market name and real size for ETH-PERP (base decimals 18)
Severity: normal
Area: app

## Steps to reproduce
1. Open an ETH-PERP trade: https://explorer.testnet.somnia.network/tokyo/tx/0x96523c38c62eec6309182a56ddaa3f003b5123ccdaefb3da7920b8369fe1d7e5
2. In "What this transaction did", the card reads `TRADE  ETH-PERP · 0.0081 @ 2,474.67`, and the decoded first argument of the call is labelled `ETH-PERP`.
3. Open a trade I placed from the app's ZEC-PERP page: https://explorer.testnet.somnia.network/tokyo/tx/0x45b4c5cd9685d4721f5878a0b70d9809fcc11ac8720309f6015c4a9d10d13a2d
4. Read the same card, and the first argument of the call (`0x2a73129F26917124bd2A47a9B355C395C537F050`).
5. Optional check: the SDK's live market list gives ZEC-PERP `baseDecimals` = 8 and ETH-PERP `baseDecimals` = 18 (printed by a read-only script using `perpMarkets()` from the bot kit's perp-core, SDK 0.31.0).

## Expected
`TRADE  ZEC-PERP · <size> @ 1,304.79`: the market name resolved and a non-zero size, as for ETH-PERP, and the pool argument labelled with its market name.

## Actual
The card reads `TRADE  0x2a73…f050 · 0 @ 1,304.79`. The market appears as a shortened pool address and the size as `0`, and the pool argument has no label. The same happens on https://explorer.testnet.somnia.network/tokyo/tx/0x37b47b06cee43d205559ca27aefba9ccf2d0590cbaf8ae5bf33b563dcf513293 (`0x2a73…f050 · 0 @ 1,305.77`). The prices are right, but the size is shown as 0. A likely cause: the explorer divides the raw size by 18 decimals for every market. ZEC-PERP's size has 8 decimals, so 0.015 ZEC (raw 1,500,000) displays as 0.000000000001500000, which rounds to 0, while ETH-PERP, which has 18 decimals, displays correctly. The live market list shows base decimals of 6, 7, 8, 9, 18 and 24 across the perps markets (for example BTC-PERP 8, SOL-PERP 9, HYPE-PERP 6, DOGE-PERP 8, NEAR-PERP 24), so other non-18-decimal markets are probably affected as well. I only checked ZEC-PERP in the explorer.

## Evidence
ETH-PERP card: ![ETH trade card](images/005-eth-trade-card.png)
ZEC-PERP cards: ![ZEC trade card 1](images/005-zec-trade-card-1.png) ![ZEC trade card 2](images/005-zec-trade-card-2.png)
Both ZEC transactions have status SUCCESS (blocks 29,814,505 and 29,815,012). The bot order that opened my earlier ZEC position was 0.015 ZEC (bot log: "placed open long 0.015 ZEC @ 1329.943 | filled 0.015").
Base decimals per market (live, 2026-10-22): BTC 8, ETH 18, HYPE 6, SOL 9, XRP 6, ADA 6, AVAX 18, BNB 18, DOGE 8, LINK 18, NEAR 24, SUI 9, XLM 7, 1000PEPE 18, LIT 18, PUMP 6, TAO 9, VVV 18, WLD 18, ZEC 8, ZRO 18.

## Environment
Somnia Tokyo testnet explorer, Safari on iPad, 2026-10-22. Wallet address: 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C

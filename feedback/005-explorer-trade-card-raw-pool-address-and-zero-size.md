# Explorer trade card shows a shortened pool address and size "0" for ZEC-PERP trades, but a market name and real size for ETH-PERP
Severity: normal
Area: app

## Steps to reproduce
1. Open an ETH-PERP trade: https://explorer.testnet.somnia.network/tokyo/tx/0x96523c38c62eec6309182a56ddaa3f003b5123ccdaefb3da7920b8369fe1d7e5
2. In "What this transaction did", the card reads `TRADE  ETH-PERP · 0.0081 @ 2,474.67`, and the decoded first argument of the call is labelled `ETH-PERP`.
3. Open a trade I placed from the app's ZEC-PERP page: https://explorer.testnet.somnia.network/tokyo/tx/0x45b4c5cd9685d4721f5878a0b70d9809fcc11ac8720309f6015c4a9d10d13a2d
4. Read the same card, and the first argument of the call (`0x2a73129F26917124bd2A47a9B355C395C537F050`).

## Expected
`TRADE  ZEC-PERP · <size> @ 1,304.79`: the market name resolved and a non-zero size, as for ETH-PERP, and the pool argument labelled with its market name.

## Actual
The card reads `TRADE  0x2a73…f050 · 0 @ 1,304.79`. The market appears as a shortened pool address and the size as `0`, and the pool argument has no label. The same happens on https://explorer.testnet.somnia.network/tokyo/tx/0x37b47b06cee43d205559ca27aefba9ccf2d0590cbaf8ae5bf33b563dcf513293 (`0x2a73…f050 · 0 @ 1,305.77`). The prices look right, so the size looks rounded to 0 (possibly a decimals or scale issue for this market's base asset) and the market name is not resolved.

## Evidence
ETH-PERP card: ![ETH trade card](images/005-eth-trade-card.png)
ZEC-PERP cards: ![ZEC trade card 1](images/005-zec-trade-card-1.png) ![ZEC trade card 2](images/005-zec-trade-card-2.png)
Both ZEC transactions have status SUCCESS (blocks 29,814,505 and 29,815,012).

## Environment
Somnia Tokyo testnet explorer, Safari on iPad, 2026-10-22. Wallet address: 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C

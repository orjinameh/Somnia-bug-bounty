# Explorer trade card shows the pool address and size "0" for some perps trades, but a market name and real size for ETH-PERP
Severity: normal
Area: app

## Steps to reproduce
1. Open an ETH-PERP trade: https://explorer.testnet.somnia.network/tokyo/tx/0x96523c38c62eec6309182a56ddaa3f003b5123ccdaefb3da7920b8369fe1d7e5
2. Read "What this transaction did": it shows `TRADE  ETH-PERP · 0.0081 @ 2,474.67`.
3. Open a trade on the market at pool 0x2a73129F26917124bd2A47a9B355C395C537F050 (<MARKET NAME, e.g. ZEC-PERP>): https://explorer.testnet.somnia.network/tokyo/tx/0x45b4c5cd9685d4721f5878a0b70d9809fcc11ac8720309f6015c4a9d10d13a2d
4. Read the same card.

## Expected
`TRADE  <MARKET NAME> · <size> @ 1,304.79`, with the market name and a non-zero size, as for ETH-PERP.

## Actual
The card shows `TRADE  0x2a73…f050 · 0 @ 1,304.79`: the market appears as a shortened pool address and the size as `0`. The same happens for 0x37b47b06cee43d205559ca27aefba9ccf2d0590cbaf8ae5bf33b563dcf513293 (`0x2a73…f050 · 0 @ 1,305.77`). The prices look right, so the size appears to be rounded to 0 (possible decimals or scale issue for this market's base asset) and the market name is not resolved.

## Evidence
Screenshots of both cards: <ATTACH AT feedback/images/005-eth.png and feedback/images/005-zec.png>
The transactions are successful (status SUCCESS, blocks 29,814,505 and 29,815,012). Actual order size from the bot log for the opening trade: <SIZE, e.g. 0.015 ZEC>

## Environment
Somnia Tokyo testnet explorer, 2026-10-22. Wallet address: <YOUR_ADDRESS>

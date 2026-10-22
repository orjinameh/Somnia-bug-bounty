# ZEC-PERP accepts orders from an account funded with paper USDso, although the docs say the credit does not cover ZEC-PERP
Severity: major
Area: contracts

## Steps to reproduce
1. Join the Perps Arena in the app and move the 1,000 USDso paper credit to the Perps account of wallet 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C (margin 1000.00 USDso unlocked, no other deposits).
2. The perps trading docs (https://app.testnet.dreamdex.io/docs/trading/perps-testnet) list ZEC-PERP with "Paper USDso: No". The developer reference (https://app.testnet.dreamdex.io/docs/developers/perps-testnet) says: "The credit comes with rules, most importantly that it can only open positions in the markets on its allowlist.", "Increasing a position in a market outside the credit's allowlist reverts", and that `getMaxPerpOrderSize` reports it as `limitedBy: "voucherBlocked"`.
3. Run the open-source bot kit (somnia-chain/dreamdex-bot-kit, commit 25798660bbe4674a6f83a960b202852896e2fed4) in trading-key mode: bot key 0xb094258AA720Eb00D6E9d34c1E163711c375f00d linked to wallet 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C, `NETWORK=hideki`, `DRY_RUN=false`, then `PERP_SYMBOL=ZEC-PERP npm start -w perp-starter`. Before sending, the kit asks `getMaxPerpOrderSize` and refuses with a voucher message when `limitedBy` is `voucherBlocked`.
4. In the app, on the ZEC-PERP page of the same account, place a buy order and then a sell order to close.

## Expected
Per the docs, a position cannot be opened or increased in ZEC-PERP with paper credit. The bot kit's pre-check should refuse with the voucher message, and the app should block the order.

## Actual
The bot kit did not refuse; the order was placed and filled. The app also let me buy ZEC-PERP, with no warning or error, and then sell to close.

Bot log (about 01:27 UTC, 2026-10-22):
```
perp-starter on ZEC-PERP (ZEC/USDso: USDso) | long 20 USDso at 2x | take-profit 2% stop-loss 1% | dry-run false
trading key 0xb094258AA720Eb00D6E9d34c1E163711c375f00d trades for 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C on ZEC-PERP
MarginBank ready: 1000.06 unlocked, 0.00 locked, equity 1000.06, status Healthy.
placed open long 0.015 ZEC @ 1329.943 | filled 0.015 | order 405828369621612501780
watching take-profit 1354.85 and stop-loss 1315.00
```
App orders on the same account: buy https://explorer.testnet.somnia.network/tokyo/tx/0x45b4c5cd9685d4721f5878a0b70d9809fcc11ac8720309f6015c4a9d10d13a2d (01:43:55 UTC, trade @ 1,304.79) and sell https://explorer.testnet.somnia.network/tokyo/tx/0x37b47b06cee43d205559ca27aefba9ccf2d0590cbaf8ae5bf33b563dcf513293 (01:44:45 UTC, trade @ 1,305.77). Both status SUCCESS.

I cannot tell which of these is the cause, so I list them for the team: (a) the allowlist is not enforced on ZEC-PERP, (b) the docs table is out of date and ZEC-PERP is now on the allowlist, or (c) the account balance is not treated as voucher funds, for example because of 0.06 USDso of realised profit from an earlier ETH-PERP round trip (the balance was 1000.00 at the start). If (b) or (c) is the case, this is a documentation problem and can be downgraded. If (a), a market excluded from the credit on purpose can be traded with it.

## Evidence
Bot log above; order id 405828369621612501780; the two transaction links above; screenshot of the app's ZEC-PERP page with the order accepted: ![ZEC order in app](images/006-app-zec-order.png)

## Environment
SDK: `@somnia-chain/markets-sdk` 0.31.0 for the bot kit's perp-core (see report 007); the app was used for the app orders. Network: Somnia Tokyo testnet (Hideki, chain 50383). Account wallet: 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C. Bot key: 0xb094258AA720Eb00D6E9d34c1E163711c375f00d. Safari on iPad for the app.

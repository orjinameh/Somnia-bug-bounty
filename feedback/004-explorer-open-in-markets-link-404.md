# Explorer "Open in Markets" link on trade transactions leads to a 404 page
Severity: normal
Area: app

## Steps to reproduce
1. Open the transaction https://explorer.testnet.somnia.network/tokyo/tx/0x45b4c5cd9685d4721f5878a0b70d9809fcc11ac8720309f6015c4a9d10d13a2d (a perps trade, "What this transaction did" card).
2. Click "Open in Markets →" on the TRADE card (or "Markets" under "Touches").
3. Note the URL the browser opens (expected form: https://explorer.testnet.somnia.network/tokyo/markets/tx/0x45b4c5cd9685d4721f5878a0b70d9809fcc11ac8720309f6015c4a9d10d13a2d).

## Expected
A page showing the market-level view of the trade.

## Actual
The explorer shows "404 - Nothing at this address. The page you were looking for doesn't exist in the explorer." with a "Back to overview" button. Same result from the other perps trade transactions I tried: 0x96523c38c62eec6309182a56ddaa3f003b5123ccdaefb3da7920b8369fe1d7e5 and 0x37b47b06cee43d205559ca27aefba9ccf2d0590cbaf8ae5bf33b563dcf513293.

## Evidence
Screenshot of the 404 page: <ATTACH SCREENSHOT AT feedback/images/004-404.png>
Exact URL shown in the address bar: <PASTE URL>

## Environment
Somnia Tokyo testnet explorer (browser: <BROWSER>), 2026-10-22. Wallet address: <YOUR_ADDRESS>

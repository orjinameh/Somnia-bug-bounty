# Explorer "Open in Markets" link on a perps trade transaction leads to a 404 page
Severity: normal
Area: app

## Steps to reproduce
1. Open the perps trade transaction https://explorer.testnet.somnia.network/tokyo/tx/0x37b47b06cee43d205559ca27aefba9ccf2d0590cbaf8ae5bf33b563dcf513293
2. In the "What this transaction did" card (TRADE), click "Open in Markets →".
3. The browser opens https://explorer.testnet.somnia.network/tokyo/markets/tx/0x37b47b06cee43d205559ca27aefba9ccf2d0590cbaf8ae5bf33b563dcf513293

## Expected
A page with the market-level view of the trade.

## Actual
The explorer shows "404 - Nothing at this address. The page you were looking for doesn't exist in the explorer." with a "Back to overview" button. The other trade transactions use the same link form (`/tokyo/markets/tx/<hash>`), for example 0x96523c38c62eec6309182a56ddaa3f003b5123ccdaefb3da7920b8369fe1d7e5 and 0x45b4c5cd9685d4721f5878a0b70d9809fcc11ac8720309f6015c4a9d10d13a2d.

## Evidence
URL above. Screenshot of the 404 page: ![404 page](images/004-explorer-404.png)

## Environment
Somnia Tokyo testnet explorer, Safari on iPad, 2026-10-22. Wallet address: 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C

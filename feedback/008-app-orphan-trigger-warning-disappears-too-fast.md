# App warning about leftover stop/take-profit triggers on markets with no open position disappears within a split second
Severity: normal
Area: app

## Steps to reproduce
1. Sign in to https://app.testnet.dreamdex.io/perps with wallet 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C on the ETH-PERP page.
2. Click "Long" on ETH-PERP. A warning appears under the "Enter a size first" prompt.
3. Open a small ETH-PERP long, then close it in the app.
4. After the close, the same warning appears again.

## Expected
A warning about money and about a future position stays on screen long enough to read, for example as inline text, or until the user dismisses it.

## Actual
The warning shows for only a split second, both after clicking Long and after closing the position, so it can hardly be read. The text is:
"2 triggers on markets with no open position. They will spend their STT fees if triggered, and would close a new position on that market."
This is important information: leftover triggers can close a position the user opens later and spend the STT deposits. A push notification afterwards says the fees have returned, and the amount matched the actual fees, so the refund itself looks correct. Only the warning is hard to read.

## Evidence
The message text above, copied from the app. It disappears too quickly to capture in a still screenshot.

## Environment
dreamDEX app on Somnia Tokyo testnet, Safari on iPad, 2026-10-22. Wallet address: 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C

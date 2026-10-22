# Bot kit README says "five runnable strategies" but the repo has 19 strategy folders
Severity: normal
Area: docs

## Steps to reproduce
1. `git clone https://github.com/somnia-chain/dreamdex-bot-kit && cd dreamdex-bot-kit`
2. Read line 5 of `README.md`: "...a shared client library, five runnable strategies, operations docs..."
3. Run `ls strategies`

## Expected
The README count matches the repo, or the README avoids a number.

## Actual
`ls strategies` lists 19 folders: ec-laddering-bot, ec-maker, ec-oracle-follow, ec-passive, ec-settlement, ec-starter, ensemble, grid, market-making, mean-reversion, momentum, perp-funding, perp-guard, perp-maker, perp-starter, starter, treasury, twap, yield-optimizer. The README table itself also lists the four `perp-*` strategies, so "five" is out of date and undersells the perps strategies this bounty is about.

## Evidence
Commit 25798660bbe4674a6f83a960b202852896e2fed4 (2026-10-12): `README.md` line 5 versus the output of `ls strategies`.

## Environment
Docs only. Bot kit commit above. Network: Somnia Tokyo testnet. Wallet address: 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C

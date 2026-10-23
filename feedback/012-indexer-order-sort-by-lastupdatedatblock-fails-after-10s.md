# Indexer: sorting the Order table by lastUpdatedAtBlock fails with "database query error" after about 10 seconds

Severity: normal
Area: API

## Steps to reproduce

Run these against the public Hideki indexer from any terminal (no account or key needed):

1. Sorted by `lastUpdatedAtBlock`, 10 rows. This is the failing query:

```
curl -s -X POST https://hideki-dev.smk.somnia.host/v1/graphql \
  -H 'content-type: application/json' \
  -d '{"query":"{ Order(limit: 10, order_by: {lastUpdatedAtBlock: desc}) { id status } }"}'
```

2. Same query, sorted by `placedAtTimestamp` instead. This one works:

```
curl -s -X POST https://hideki-dev.smk.somnia.host/v1/graphql \
  -H 'content-type: application/json' \
  -d '{"query":"{ Order(limit: 10, order_by: {placedAtTimestamp: desc}) { id status } }"}'
```

3. Filtering to one market does not fix query 1 (BTC-PERP pool 0x4181dd08e73bbcdd1ba3e615a18f6abd941b94c0, 500 rows):

```
curl -s -X POST https://hideki-dev.smk.somnia.host/v1/graphql \
  -H 'content-type: application/json' \
  -d '{"query":"{ Order(limit: 500, where: {market_id: {_eq: \"0x4181dd08e73bbcdd1ba3e615a18f6abd941b94c0\"}}, order_by: {lastUpdatedAtBlock: desc}) { id status } }"}'
```

## Expected

`lastUpdatedAtBlock` is a normal column of the `Order` table and is accepted by the `Order_order_by` input type, so a query sorted by it should return rows, like the same query sorted by `placedAtTimestamp` does. If the column cannot be sorted on, the schema should not offer it for sorting, or the error should say so.

## Actual

Queries 1 and 3 take about 10 seconds and then return HTTP 200 with only this error body (no rows, no reason):

```
[{"message":"database query error","extensions":{"path":"$","code":"unexpected"}}]
```

The delay is almost the same every time (10.25 s, 10.25 s, 10.75 s), which looks like a server-side statement timeout. That is my inference; I can only see the timing, not the server. It fails even with `limit: 10`, and it fails when filtered to a single market. Because the HTTP status is 200, a client that only checks the status code treats it as a success.

## Evidence

Measured from one machine, one run of each query, 2026-10-23 around 10:30 UTC (`Order` rows, `id status` fields):

| Query | Result | Time |
|---|---|---|
| `limit: 1`, no sort | 1 row | 1214 ms |
| `limit: 10`, sort `lastUpdatedAtBlock` desc | `database query error` | 10252 ms |
| `limit: 500`, sort `lastUpdatedAtBlock` desc | `database query error` | 10747 ms |
| `limit: 500`, sort `placedAtTimestamp` desc | 500 rows | 988 ms |
| `limit: 500`, no sort | 500 rows | 250 ms |
| `limit: 500`, BTC-PERP `market_id`, sort `placedAtTimestamp` desc | 500 rows | 255 ms |
| `limit: 500`, BTC-PERP `market_id`, sort `lastUpdatedAtBlock` desc | `database query error` | 10251 ms |
| `limit: 500`, one owner address, sort `lastUpdatedAtBlock` desc | 164 rows (the owner's orders) | 728 ms |

Other tables sorted the same way worked: `Fill` sorted by `blockNumber` desc, 500 rows, 875 ms; `PerpOrderRejection` sorted by `blockNumber` desc, 500 rows, 628 ms.

So the sort on `lastUpdatedAtBlock` only works when the query is narrowed to one owner. Anyone who wants "the most recently updated orders" (for example to follow cancellations or fills) across all orders or one market cannot get them. Workaround found: sort by `placedAtTimestamp`, which only gives the newest placed orders, not recently changed ones.

## Environment

- Endpoint: https://hideki-dev.smk.somnia.host/v1/graphql (Hideki testnet indexer, chain 50383)
- Indexer state at the time: about 10 blocks behind chain head (`chain_metadata.latest_processed_block` 30990335 vs head 30990345)
- Client: Node.js `fetch` and `curl`, from a GitHub Codespace
- Date: 2026-10-23

// Checks the docs claim that a single account's position cap is "usually one-tenth of the market's
// open-interest cap" (developer reference and trader docs) against the live SDK, for all 21 markets.
// Read-only. Run from the docs-examples folder after `npm install`:
//
//   OWNER_ADDRESS=0xYourAppWallet npx tsx position-caps.ts
//
import { formatUnits } from "viem";
import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk";
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains";

// Open-interest caps copied from the docs market table (2026-10-22), in whole base units.
const DOCS_OI_CAP: Record<string, number> = {
  BTC: 246.81545, ETH: 3995.6125, HYPE: 23812.72, SOL: 47654.44, XRP: 344632, ADA: 2254678,
  AVAX: 66672.2, BNB: 693.975, DOGE: 5613590, LINK: 42643.6, NEAR: 250410, SUI: 635009,
  XLM: 2677780, "1000PEPE": 130285600, LIT: 138896.6, PUMP: 87993700, TAO: 2185.491,
  VVV: 21786.14, WLD: 1264000, ZEC: 420, ZRO: 250599.5,
};

const account = (process.env.OWNER_ADDRESS ?? "").trim() as `0x${string}`;
if (!account) throw new Error("Set OWNER_ADDRESS to your app wallet.");

const markets = new SomniaMarkets({
  chain: hidekiTestnet,
  indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql",
  addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES,
});

const perps: any[] = await markets.client.listPerpMarkets();
const odd: string[] = [];
console.log("market | maxPositionSize (live) | docs OI cap | live / OI cap | docs claim: ~0.10");
for (const m of perps) {
  const cap = DOCS_OI_CAP[m.baseSymbol];
  try {
    const tick = BigInt(m.tickSize ?? m.ticksize);
    const mark = BigInt(m.markPrice);
    const price = (mark / tick) * tick;
    const max = await markets.client.getMaxPerpOrderSize({
      pool: m.poolAddress,
      marginBank: m.marginBank,
      account,
      isBid: true,
      price,
    });
    const maxPos = Number(formatUnits(BigInt(max.maxPositionSize), m.baseDecimals));
    const ratio = cap ? maxPos / cap : NaN;
    console.log(`${String(m.baseSymbol).padEnd(9)} | ${maxPos} | ${cap ?? "not in docs"} | ${Number.isFinite(ratio) ? ratio.toFixed(3) : "n/a"}`);
    if (Number.isFinite(ratio) && Math.abs(ratio - 0.1) > 0.01) odd.push(`${m.baseSymbol}: ${ratio.toFixed(3)} of the docs OI cap`);
  } catch (e) {
    console.log(`${String(m.baseSymbol).padEnd(9)} | THROWS: ${e instanceof Error ? e.message.split("\n")[0] : String(e)}`);
  }
}
console.log(`\n${odd.length === 0 ? "All markets are within 1% of one tenth." : "Not one tenth of the docs OI cap:"}`);
for (const o of odd) console.log(` - ${o}`);
process.exit(0);

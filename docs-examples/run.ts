// Runs the read-only examples from https://app.testnet.dreamdex.io/docs/developers/perps-testnet
// against the live testnet with the SDK version the page names (0.32.1). Sends no transactions.
//
//   OWNER_ADDRESS=0xYourAppWallet npx tsx run.ts
//
// Each step is wrapped so that one failure does not hide the others. A step that throws, or a
// value that differs from the docs, is a lead for a report: re-run it by hand before writing it up.
import { parseUnits } from "viem";
import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk";
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains";

const json = (v: unknown) => JSON.stringify(v, (_k, x) => (typeof x === "bigint" ? x.toString() : x), 2);
const step = async (name: string, fn: () => Promise<void>) => {
  console.log(`\n=== ${name}`);
  try {
    await fn();
  } catch (e) {
    console.log(`THROWS: ${e instanceof Error ? e.message.split("\n")[0] : String(e)}`);
  }
};

// Copied from the "Contracts" table of the developer reference.
const DOCS_CONTRACTS: Record<string, string> = {
  MarginBank: "0x478769E1177C0773c43A593DCCc4Ad15F15F1394",
  "Collateral (USDso)": "0xed7993A74dAe1e6656B704A424DcD8711aAf4F72",
  PerpPoolFactory: "0xE631fAEE547baeE07353E290f0562ea67d856560",
  LiquidationEngine: "0xA66d3C24Ad4a389d863846905D8173e1017e9F4D",
  InsuranceFund: "0x50826894D47C6D4f3BeA38BFDC7Dc5c5be171b80",
  "VoucherDistributor (paper USDso)": "0x2ACD9EFdA721450906bfE1bef3edE269636E42C4",
  OperatorPermissionsRegistry: "0x6B2FbfeD328FF5F20C0BE7D3C3437613aFFE8D3a",
};
const has = (haystack: unknown, addr: string) => json(haystack).toLowerCase().includes(addr.toLowerCase());

const markets = new SomniaMarkets({
  chain: hidekiTestnet,
  indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql",
  addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES,
}); // read-only: no privateKey, as the docs allow

const account = (process.env.OWNER_ADDRESS ?? "").trim() as `0x${string}`;
let perps: any[] = [];

await step("listPerpMarkets (docs: client.listPerpMarkets())", async () => {
  perps = await markets.client.listPerpMarkets();
  console.log(`${perps.length} markets; first row keys: ${Object.keys(perps[0] ?? {}).join(", ")}`);
  const btc = perps.find((m) => m.baseSymbol === "BTC");
  console.log(btc ? "BTC row found by baseSymbol === 'BTC' (as in the docs example)" : "NO BTC row found with baseSymbol === 'BTC'");
});

const btc = perps.find((m) => m.baseSymbol === "BTC");

await step("addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES versus the docs contract table", async () => {
  for (const [name, addr] of Object.entries(DOCS_CONTRACTS)) {
    console.log(`${has(SOMNIA_HIDEKI_TESTNET_ADDRESSES, addr) ? "in SDK addresses " : "NOT in SDK addresses"} | ${name} ${addr}`);
  }
  console.log(`SDK 'collateral' = ${(SOMNIA_HIDEKI_TESTNET_ADDRESSES as any).collateral}  (docs say this is NOT the perps collateral)`);
  if (btc) console.log(`BTC row quoteToken = ${btc.quoteToken}  (docs collateral: ${DOCS_CONTRACTS["Collateral (USDso)"]})`);
});

await step("getPerpSystemConfig (docs: verify the MarginBank before trusting a market list)", async () => {
  if (!btc) throw new Error("no BTC market, skipped");
  const cfg = await markets.client.getPerpSystemConfig(btc.marginBank);
  console.log(json(cfg));
  for (const [name, addr] of Object.entries(DOCS_CONTRACTS)) {
    console.log(`${has(cfg, addr) ? "present" : "ABSENT "} in system config | ${name}`);
  }
});

for (const sym of ["BTC", "ZEC"]) {
  const m = perps.find((x) => x.baseSymbol === sym);
  await step(`getMaxPerpOrderSize on ${sym}-PERP (docs example, buy)`, async () => {
    if (!m) throw new Error(`no ${sym} market`);
    if (!account) throw new Error("set OWNER_ADDRESS to your app wallet to run this step");
    const mark = Number(m.markPrice) / 1e18;
    const price = parseUnits(String(Math.round(mark)), m.quoteDecimals);
    const max = await markets.client.getMaxPerpOrderSize({
      pool: m.poolAddress,
      marginBank: m.marginBank,
      account,
      isBid: true,
      price,
    });
    console.log(json(max));
    console.log(`fields the docs name: maxQuantity=${"maxQuantity" in max} limitedBy=${"limitedBy" in max} priceable=${"priceable" in max} placeable=${"placeable" in max} maxPositionSize=${"maxPositionSize" in max}`);
  });
}

await step("getPerpVoucherEligibility (docs: check before claiming the one-time credit)", async () => {
  if (!btc) throw new Error("no BTC market, skipped");
  if (!account) throw new Error("set OWNER_ADDRESS to your app wallet to run this step");
  console.log(json(await markets.client.getPerpVoucherEligibility(btc.marginBank, account)));
});

console.log("\nDone.");
process.exit(0);

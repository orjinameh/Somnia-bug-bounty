# SDK's bundled Hideki addresses have no operatorPermissionsRegistry, so a perp stop order cannot be placed with the docs' setup example, and the docs do not say so
Severity: normal
Area: SDK

## Steps to reproduce
1. Use the setup from the developer reference (https://app.testnet.dreamdex.io/docs/developers/perps-testnet), "SDK Install and Setup", with `@somnia-chain/markets-sdk` 0.32.1. Its `addresses` line is: `addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES,`
2. Print the registry the SDK would use for a perp stop order:
   ```
   node --input-type=module -e "import { SOMNIA_HIDEKI_TESTNET_ADDRESSES as a } from '@somnia-chain/markets-sdk'; console.log(a.operatorPermissionsRegistry)"
   ```
   Output: `undefined`.
3. Read the SDK source that places a perp stop order (`node_modules/@somnia-chain/markets-sdk/dist/perp/stops.js`, function `operatorGrantCall`):
   ```
   const operatorRegistry = p.operatorRegistry ?? w.addresses().operatorPermissionsRegistry;
   if (!operatorRegistry) {
       throw new NotConfiguredError("operatorRegistry or addresses.operatorPermissionsRegistry", "a perp stop order");
   }
   ```
4. Compare with the docs: the contracts table lists `OperatorPermissionsRegistry | 0x6B2FbfeD328FF5F20C0BE7D3C3437613aFFE8D3a`, and the pitfalls list says "Stop orders carry 0.15 STT each, sent with the order and refunded on cancel."

## Expected
Following the docs' setup, `trader.placePerpStopOrder` can arm a take-profit or stop-loss on Hideki, or the docs say that `operatorPermissionsRegistry` (or `operatorRegistry` per call) must be passed to the SDK.

## Actual
`SOMNIA_HIDEKI_TESTNET_ADDRESSES.operatorPermissionsRegistry` is `undefined`, so by the code above `placePerpStopOrder` throws `NotConfiguredError` ("operatorRegistry or addresses.operatorPermissionsRegistry" is missing) unless the caller adds the address. The docs list the address in a table but their setup example does not pass it, and nothing on the page tells a developer that stop orders need it. The SDK's own type comment for `operatorPermissionsRegistry` only describes spot stop orders ("users operator-approve a SpotStopOrderRegistry here"), not perp ones. The bot kit hit the same problem and works around it with a hard-coded address and a code comment (`packages/perp-core/src/config.ts`: "It is NOT in the SDK's bundled address sets ... `placePerpStopOrder` throws `NotConfiguredError` unless it is passed explicitly").

## Evidence
Step 2 output (`undefined`) and the step 3 source lines above; the `addresses` line and the contracts table row from the docs page; the bot kit comment in `packages/perp-core/src/config.ts` (commit 25798660bbe4674a6f83a960b202852896e2fed4). The SDK's perp-stop-order function is documented as `placePerpStopOrder(params)` in `dist/trade.d.ts`. I did not send a stop order; this is from the SDK source and a read-only print.

## Environment
`@somnia-chain/markets-sdk` 0.32.1, Somnia Tokyo testnet (Hideki, chain 50383), 2026-10-23. Wallet address: 0xD03f3458FdDC1722dE3a4c01307A9D92c1cB0F8C

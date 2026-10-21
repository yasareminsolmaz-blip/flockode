// One non-consumable in-app purchase unlocks worlds 3–20.
//
// In TestFlight and App Store builds this talks to Apple through expo-iap (StoreKit).
// Expo Go has no StoreKit module, so there the shop runs in TEST MODE: "Buy" unlocks locally after
// the parental gate, and the shop shows extra test tools. Those tools never appear in real builds.

import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

export const FULL_VERSION_PRODUCT_ID = 'com.yasarss.flockode.full';

/** True in Expo Go (and on web), where purchases are simulated. */
export const PURCHASES_TEST_MODE =
  Platform.OS !== 'ios' || Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export type PurchaseResult = 'purchased' | 'cancelled' | 'pending' | 'failed';

type Iap = typeof import('expo-iap');
type Purchase = import('expo-iap').Purchase;

let iap: Iap | null = null;
let connected: Promise<boolean> | null = null;
let onUnlocked: (() => void) | null = null;

function load(): Iap | null {
  if (PURCHASES_TEST_MODE) return null;
  if (!iap) {
    try {
      // Loaded lazily so Expo Go never touches the missing native module.
      iap = require('expo-iap') as Iap;
    } catch {
      return null;
    }
  }
  return iap;
}

const isFull = (p: Purchase | null | undefined) => !!p && p.productId === FULL_VERSION_PRODUCT_ID;

async function deliver(p: Purchase) {
  // Non-consumable: finishing tells Apple the content was delivered; ignore "already finished".
  await load()?.finishTransaction({ purchase: p, isConsumable: false }).catch(() => {});
  onUnlocked?.();
}

/** Connects to the App Store once and listens for purchases (including ones approved later, e.g. Ask to Buy). */
function connect(): Promise<boolean> {
  const m = load();
  if (!m) return Promise.resolve(false);
  if (!connected) {
    connected = m
      .initConnection()
      .then(() => {
        m.purchaseUpdatedListener((p) => {
          if (isFull(p)) deliver(p);
        });
        return true;
      })
      .catch(() => {
        connected = null;
        return false;
      });
  }
  return connected;
}

/**
 * Called once at app start. Unlocks the full version silently when the App Store already has
 * the purchase on this Apple Account (new device, reinstall, Family Sharing).
 */
export async function startPurchases(unlock: () => void) {
  onUnlocked = unlock;
  if (!(await connect())) return;
  try {
    const owned = await load()!.getAvailablePurchases({ onlyIncludeActiveItemsIOS: true });
    if (owned.some(isFull)) unlock();
  } catch {
    // Offline or not signed in: keep what the device already knows.
  }
}

/** Localized price from the App Store, e.g. "₺99,99" or "$2.99"; null when unavailable. */
export async function getFullVersionPrice(): Promise<string | null> {
  if (!(await connect())) return null;
  try {
    const products = await load()!.fetchProducts({ skus: [FULL_VERSION_PRODUCT_ID], type: 'in-app' });
    const list = (products ?? []) as { id: string; displayPrice: string }[];
    const p = list.find((x) => x.id === FULL_VERSION_PRODUCT_ID);
    return p?.displayPrice ?? null;
  } catch {
    return null;
  }
}

export async function buyFullVersion(): Promise<PurchaseResult> {
  if (PURCHASES_TEST_MODE) return 'purchased';
  if (!(await connect())) return 'failed';
  const m = load()!;
  try {
    // StoreKit needs the product loaded before it can be bought.
    await m.fetchProducts({ skus: [FULL_VERSION_PRODUCT_ID], type: 'in-app' });
    const result = await m.requestPurchase({
      request: { apple: { sku: FULL_VERSION_PRODUCT_ID }, google: { skus: [FULL_VERSION_PRODUCT_ID] } },
      type: 'in-app',
    });
    const purchases = (Array.isArray(result) ? result : result ? [result] : []) as Purchase[];
    const p = purchases.find(isFull);
    if (p) {
      if (String(p.purchaseState) === 'pending') return 'pending';
      await deliver(p);
      return 'purchased';
    }
    // No purchase returned yet: it may arrive through the listener (e.g. Ask to Buy).
    return 'pending';
  } catch (e) {
    const code = (e as { code?: string } | null)?.code;
    if (code === m.ErrorCode.UserCancelled) return 'cancelled';
    return 'failed';
  }
}

/** Returns true when an earlier full-version purchase was found. */
export async function restorePurchases(): Promise<boolean> {
  if (PURCHASES_TEST_MODE) return false;
  if (!(await connect())) return false;
  const m = load()!;
  try {
    await m.restorePurchases();
    const owned = await m.getAvailablePurchases({ onlyIncludeActiveItemsIOS: true });
    const p = owned.find(isFull);
    if (p) {
      onUnlocked?.();
      return true;
    }
  } catch {
    // fall through
  }
  return false;
}

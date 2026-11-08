import { AsyncLocalStorage } from 'async_hooks';

/**
 * Display currency for the app handling the current request.
 *
 * Amounts are stored as whole units of the app's own currency (KES unless
 * the app's settings say otherwise, e.g. Berry Fitness uses USD). The tenant
 * middleware sets it for the request, so emails and WhatsApp messages built
 * anywhere downstream format money correctly without passing it around.
 */
const store = new AsyncLocalStorage<string>();

export const DEFAULT_CURRENCY = 'KES';

export function runWithCurrency<T>(currency: string | undefined, fn: () => T): T {
  return store.run((currency || DEFAULT_CURRENCY).toUpperCase(), fn);
}

export function currentCurrency(): string {
  return store.getStore() || DEFAULT_CURRENCY;
}

export function formatMoney(amount: number, currency = currentCurrency()): string {
  if (currency === 'KES') return `KES ${amount.toLocaleString('en-KE')}`;
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString('en-US')}`;
  }
}

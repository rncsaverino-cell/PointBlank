export const WHOLESALE_RULES = {
  minimumOpeningOrder: 250,
  freeShippingThreshold: 1000,
  flatShippingRate: 45,
  taxRate: 0.08,
};

export function calculateOrderTotals(subtotal: number) {
  const shipping = subtotal === 0 || subtotal >= WHOLESALE_RULES.freeShippingThreshold ? 0 : WHOLESALE_RULES.flatShippingRate;
  const tax = Math.round(subtotal * WHOLESALE_RULES.taxRate * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;
  return { shipping, tax, total };
}

import { Item } from "./types";

const DISCOUNT_RATE = 0.9;

function isDiscountEligible(item: Item) {
  return item.quantity > 10;
}

export function applyDiscountIfEligible(item: Item, subTotal: number) {
  return isDiscountEligible(item) ? subTotal * DISCOUNT_RATE : subTotal;
}

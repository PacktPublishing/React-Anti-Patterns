import { Item } from "./types";
import { applyDiscountIfEligible } from "./utils";

class ShoppingCart {
  items: Item[] = [];

  addItemToCart({ id, price, quantity }: Item) {
    this.items.push({ id, price, quantity });
  }

  calculateTotal() {
    return this.items.reduce((total, item) => {
      let subTotal = item.price * item.quantity;
      return total + applyDiscountIfEligible(item, subTotal);
    }, 0);
  }
}

export { ShoppingCart };

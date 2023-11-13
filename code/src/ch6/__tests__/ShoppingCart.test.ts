import { ShoppingCart } from "../ShoppingCart";

describe("ShoppingCart", () => {
  it("calculates item prices", () => {
    const shoppingCart = new ShoppingCart();
    shoppingCart.addItemToCart({id: "apple", price: 2.0, quantity: 2});
    shoppingCart.addItemToCart({id: "orange", price: 3.5, quantity: 1});

    const price = shoppingCart.calculateTotal();
    expect(price).toEqual(7.5);
  });

  it('applies discount when applicable', () => {
    const shoppingCart = new ShoppingCart();
    shoppingCart.addItemToCart({id: "apple", price: 2.0, quantity: 11});

    const price = shoppingCart.calculateTotal();
    expect(price).toEqual(19.8);
  })
});

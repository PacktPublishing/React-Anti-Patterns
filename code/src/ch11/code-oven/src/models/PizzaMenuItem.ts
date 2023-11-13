import { BaseMenuItem } from "./BaseMenuItem";
import { RemoteMenuItem } from "./RemoteMenuItem";

export class PizzaMenuItem extends BaseMenuItem {
  private readonly toppings: number;

  constructor(item: RemoteMenuItem, toppings: number) {
    super(item);
    this.toppings = toppings;
  }
}

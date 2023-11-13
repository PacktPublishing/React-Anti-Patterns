import {IDiscountStrategy} from "./IDiscountStrategy";

export class NoDiscountStrategy implements IDiscountStrategy {
  calculate(price: number): number {
    return 0;
  }
}

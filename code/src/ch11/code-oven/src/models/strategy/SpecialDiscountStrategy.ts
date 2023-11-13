import { IDiscountStrategy } from "./IDiscountStrategy";

export class SpecialDiscountStrategy implements IDiscountStrategy {
  calculate(price: number): number {
    return price * 0.15;
  }
}

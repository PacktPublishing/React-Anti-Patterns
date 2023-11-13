import { IDiscountStrategy } from "./IDiscountStrategy";

export class TenPercentDiscountStrategy implements IDiscountStrategy {
  calculate(price: number): number {
    return price * 0.1;
  }
}

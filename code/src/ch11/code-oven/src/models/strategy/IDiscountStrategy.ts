export interface IDiscountStrategy {
  calculate(price: number): number;
}

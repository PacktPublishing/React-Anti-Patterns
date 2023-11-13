import {IDiscountStrategy} from "./strategy/IDiscountStrategy";

export interface IMenuItem {
  id: string;
  name: string;
  type: string;
  price: number;
  ingredients: string[];
  discountStrategy: IDiscountStrategy;

  calculateDiscount(): number;
}

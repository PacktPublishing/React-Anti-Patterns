import React from "react";
import {render, screen, within} from "@testing-library/react";
import { PizzaShopApp } from "../App";
import userEvent from "@testing-library/user-event";
describe("Code Oven Application", () => {
  it("renders application heading", () => {
    render(<PizzaShopApp />);
    const heading = screen.getByText("The Code Oven");
    expect(heading).toBeInTheDocument();
  });

  it("renders menu list", () => {
    render(<PizzaShopApp />);
    const menuItems = within(screen.getByTestId('menu-list')).getAllByRole('listitem');

    expect(menuItems.length).toEqual(8);

    expect(within(menuItems[0]).getByText('Margherita Pizza')).toBeInTheDocument();
    expect(within(menuItems[1]).getByText('Pepperoni Pizza')).toBeInTheDocument();
    expect(within(menuItems[2]).getByText('Veggie Supreme Pizza')).toBeInTheDocument();
  });

  it('renders a shopping cart', () => {
    render(<PizzaShopApp />);

    const shoppingCartContainer = screen.getByTestId('shopping-cart');
    const placeOrderButton = within(shoppingCartContainer).getByRole('button');

    expect(placeOrderButton).toBeInTheDocument();
    expect(placeOrderButton).toHaveTextContent('Place My Order');
    expect(placeOrderButton).toBeDisabled();
  });

  it('adds menu item to shopping cart',  async () => {
    render(<PizzaShopApp />);

    const menuItems = within(screen.getByTestId('menu-list')).getAllByRole('listitem');

    const addButton = within(menuItems[0]).getByRole('button');
    await userEvent.click(addButton);

    const shoppingCartContainer = screen.getByTestId('shopping-cart');
    const placeOrderButton = within(shoppingCartContainer).getByRole('button');

    expect(within(shoppingCartContainer).getByText('Margherita Pizza')).toBeInTheDocument();
    expect(placeOrderButton).toBeEnabled();
  })
});
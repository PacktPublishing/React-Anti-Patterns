import React from 'react';
import {render, screen, within} from '@testing-library/react';
import App from './App';
import userEvent from "@testing-library/user-event";

describe('Code Oven Application', () => {
  it('renders application heading', () => {
    render(<App/>);
    const heading = screen.getByText('The Code Oven');
    expect(heading).toBeInTheDocument();
  });

  it('renders a list of items', function () {
    render(<App />)
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(8);
  });

  it('renders pizza name', () => {
    render(<App />);

    const items = screen.getAllByRole('listitem');
    expect(within(items[0]).getByText('Margherita Pizza')).toBeInTheDocument();
    expect(within(items[1]).getByText('Pepperoni Pizza')).toBeInTheDocument();
    expect(within(items[2]).getByText('Veggie Supreme Pizza')).toBeInTheDocument();
  })


  it('renders pizza price', () => {
    render(<App />);

    const items = screen.getAllByRole('listitem');
    expect(within(items[0]).getByText('10.99')).toBeInTheDocument();
    expect(within(items[1]).getByText('12.99')).toBeInTheDocument();
    expect(within(items[2]).getByText('14.99')).toBeInTheDocument();
  })

  it('popup a diagram preview panel', () => {
    render(<App />)

    const button = screen.getByText('Show Preview');
    userEvent.click(button);

    expect(screen.getByTestId('diagram-preview-panel')).toBeInTheDocument();
  })
})

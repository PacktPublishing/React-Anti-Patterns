export interface Item {
  icon: string;
  text: string;
  description: string;
}

export interface DropdownProps {
  items: Item[];
}
export interface Item {
  id: string;
  icon: string;
  text: string;
  description: string;
}

export interface DropdownProps {
  items: Item[];
}

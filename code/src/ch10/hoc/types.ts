import {ReactNode} from "react";

export interface Toggleable {
  isOpen: boolean;
  toggle: () => void;
}

export type PanelProps = {
  heading: string;
  content: ReactNode;
}  & Partial<Toggleable>;
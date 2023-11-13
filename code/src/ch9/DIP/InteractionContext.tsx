import { createContext } from "react";

export interface InteractionMeasurement {
  measure(name: string | undefined, timestamp?: number): void;
}

export default createContext<InteractionMeasurement | null>(null);

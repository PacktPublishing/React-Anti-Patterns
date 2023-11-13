import React from "react";
import { PageProps } from "../types";

export const PageContext = React.createContext<PageProps | undefined>(
  undefined
);

import { createContext } from "react";

export const NavigationContext = createContext({
  originalPage: null,
  setOriginalPage: () => {},
});

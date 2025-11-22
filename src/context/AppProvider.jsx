import { useReducer } from "react";
import { AppContext } from "./AppContext.js";
import { initialState } from "./initialState.js";
import { appReducer } from "./AppReducer.js";

export default function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

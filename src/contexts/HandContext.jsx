import { createContext, useState } from "react";

export const HandContext = createContext();

function HandProvider({ children }) {
  const [handMoving, setHandMoving] = useState(false);

  return (
    <HandContext.Provider value={{ handMoving, setHandMoving }}>
      {children}
    </HandContext.Provider>
  );
}

export default HandProvider;

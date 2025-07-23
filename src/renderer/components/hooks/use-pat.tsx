import React, { useState, useCallback } from "react";

type PatContextType = {
  pat: string | null;
  setPat: (newPat: string | null) => void;
  deletePat: () => void;
};
const PatContext = React.createContext<PatContextType | undefined>(undefined);

function PatProvider({ children }: { children: React.ReactNode }) {
  const [pat, setPatState] = useState<string | null>(null);

  // Function to set token in memory
  const setPat = useCallback((newToken: string) => {
    setPatState(newToken);
    localStorage.setItem("pat", newToken);
  }, []);

  const deletePat = useCallback(() => {
    setPatState("");
  }, []);

  return (
    <PatContext.Provider value={{ pat, setPat: setPat, deletePat }}>
      {children}
    </PatContext.Provider>
  );
}

function usePat(): PatContextType {
  return React.useContext(PatContext);
}
export { PatProvider, usePat };

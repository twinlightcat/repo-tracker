import React, { useEffect, useState, useCallback } from "react";

type PatContextType = {
  pat: string | null;
  setPat: (newPat: string | null) => void;
  deletePat: () => void;
};
const PatContext = React.createContext<PatContextType | undefined>(undefined);

function PatProvider({ children }: { children: React.ReactNode }) {
  const [pat, setPatState] = useState<string | null>(null);

  useEffect(() => {
    const fetchPat = async () => {
      const storedPat = localStorage.getItem("pat");
      setPatState(storedPat);
    };

    fetchPat();
  }, []);

  // Function to set token in state and localStorage
  const setPat = useCallback((newToken: string) => {
    setPatState(newToken);
    localStorage.setItem("pat", newToken);
  }, []);

  const deletePat = useCallback(() => {
    setPatState("");
    localStorage.setItem("pat", "");
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

import React, { useEffect, useState, useCallback } from "react";

type PatContextType = {
  pat: string | null;
  setPat: (newPat: string | null) => void;
};
const PatContext = React.createContext<PatContextType | undefined>(undefined);

function PatProvider({ children }: { children: React.ReactNode }) {
  const [pat, setPatState] = useState<string | null>(null);

  useEffect(() => {
    const fetchPat = async () => {
      const storedPat = sessionStorage.getItem("pat");
      setPatState(storedPat);
    };

    fetchPat();
  }, []);

  // Function to set token in state and sessionStorage
  const setPat = useCallback((newToken: string) => {
    setPatState(newToken);
    sessionStorage.setItem("pat", newToken);
  }, []);

  return (
    <PatContext.Provider value={{ pat, setPat: setPat }}>
      {children}
    </PatContext.Provider>
  );
}

function usePat(): PatContextType {
  return React.useContext(PatContext);
}
export { PatProvider, usePat };

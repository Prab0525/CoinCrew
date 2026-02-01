"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type CoinsContextType = {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  addCoins: (amount: number) => void;
};

const CoinsContext = createContext<CoinsContextType | undefined>(undefined);

export function CoinsProvider({ children }: { children: React.ReactNode }) {
  const [coins, setCoins] = useState<number>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("coins") : null;
      return raw ? parseInt(raw, 10) : 0;
    } catch (e) {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("coins", String(coins));
    } catch (e) {
      // ignore
    }
  }, [coins]);

  const addCoins = (amount: number) => setCoins((c) => c + amount);

  return (
    <CoinsContext.Provider value={{ coins, setCoins, addCoins }}>
      {children}
    </CoinsContext.Provider>
  );
}

export function useCoins() {
  const ctx = useContext(CoinsContext);
  if (!ctx) throw new Error("useCoins must be used within CoinsProvider");
  return ctx;
}

export default CoinsContext;

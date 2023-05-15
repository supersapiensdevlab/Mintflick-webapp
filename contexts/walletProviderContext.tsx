"use client";
import React, { createContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type WalletContextInt = {
  solanaProvider: any;
  setSolanaProvider: (data: any) => void;
  polygonProvider: any;
  setPolygonProvider: (data: any) => void;
};

let walletContextObj: WalletContextInt = {
  solanaProvider: {},
  setSolanaProvider: (data: any) => {},
  polygonProvider: {},
  setPolygonProvider: (data: any) => {},
};

export const walletProviderContext = createContext(walletContextObj);

export default function WalletProviderContextContainer({ children }: Props) {
  const [solanaProvider, setSolanaProvider] = useState({});
  const [polygonProvider, setPolygonProvider] = useState({});

  return (
    <walletProviderContext.Provider
      value={{
        solanaProvider,
        setSolanaProvider,
        polygonProvider,
        setPolygonProvider,
      }}
    >
      {children}
    </walletProviderContext.Provider>
  );
}

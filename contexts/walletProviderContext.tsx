'use client';
import ConnectWalletModal from '@/components/organisms/ConnectWalletModal';
import React, { createContext, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

type WalletContextInt = {
  setOpenModal: Function;
  solanaProvider: any;
  setSolanaProvider: (data: any) => void;
  polygonProvider: any;
  setPolygonProvider: (data: any) => void;
};

let walletContextObj: WalletContextInt = {
  setOpenModal: () => {},
  solanaProvider: {},
  setSolanaProvider: (data: any) => {},
  polygonProvider: {},
  setPolygonProvider: (data: any) => {},
};

export const walletProviderContext = createContext(walletContextObj);

export default function WalletProviderContextContainer({ children }: Props) {
  const [solanaProvider, setSolanaProvider] = useState({});
  const [polygonProvider, setPolygonProvider] = useState({});

  const [openModal, setOpenModal] = useState(false);

  return (
    <walletProviderContext.Provider
      value={{
        setOpenModal,
        solanaProvider,
        setSolanaProvider,
        polygonProvider,
        setPolygonProvider,
      }}>
      {children}
      <ConnectWalletModal
        open={openModal}
        setOpen={() => setOpenModal(false)}
      />
    </walletProviderContext.Provider>
  );
}

import React, { useContext, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Torus from "@toruslabs/torus-embed";
import { sequence } from "0xsequence";
import { UserContext } from "../../Store";

function useWebModal() {
  const State = useContext(UserContext);

  const newWalletProvider = {
    torus: {
      package: Torus, // required
      options: {
        networkParams: {
          chainId: 80001, // default: 1
          networkName: "Mumbai Test Network",
        },
        config: {
          buildEnv: "development", // optional
        },
      },
    },
    sequence: {
      package: sequence, // required
      options: {
        appName: "My App", // optional
        defaultNetwork: "polygon", // optional
      },
    },
  };

  return async function loadWebModal(newWallet) {
    const providerOptions = newWallet
      ? {
          /* See Provider Options Section */

          walletconnect: {
            package: WalletConnectProvider, // required
            options: {
              infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", // required
            },
          },
          ...newWalletProvider,
        }
      : newWalletProvider;

    const web3Modal = new Web3Modal({
      disableInjectedProvider: !newWallet,
      network: "mainnet", // optional
      cacheProvider: false, // optional
      providerOptions, // required
    });

    const instance = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    const Address = await signer.getAddress();
    console.log(Address);
    State.updateDatabase({
      walletAddress: Address,
    });
  };
}

export default useWebModal;

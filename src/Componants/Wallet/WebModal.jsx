import React, { useContext, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Torus from "@toruslabs/torus-embed";
import { sequence } from "0xsequence";
import { UserContext } from "../../Store";

function WebModal() {
  const State = useContext(UserContext);

  async function loadWebModal() {
    const providerOptions = {
      /* See Provider Options Section */
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", // required
        },
      },
      torus: {
        package: Torus, // required
        options: {
          networkParams: {
            host: "https://localhost:8545", // optional
            chainId: 1337, // optional
            networkId: 1337, // optional
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

    const web3Modal = new Web3Modal({
      disableInjectedProvider: false,
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
  }
  useEffect(() => {
    loadWebModal();
  }, []);
}

export default WebModal;

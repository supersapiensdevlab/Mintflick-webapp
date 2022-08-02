import React, { useContext, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Torus from "@toruslabs/torus-embed";
import { sequence } from "0xsequence";
import { UserContext } from "../../Store";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function useWebModal() {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();

  async function isUserAvaliable(walletAddress) {
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_BASE_URL}/user/getuser_by_wallet`,
      data: {
        walletId: walletAddress,
      },
    })
      .then((response) => {
        console.log(response);
        navigateTo("/homescreen");
      })
      .catch(function (error) {
        console.log(error);
        navigateTo("/create_new_user");
      });
  }

  const newWalletProvider = {
    torus: {
      package: Torus, // required
      options: {
        networkParams: {
          chainId: "137", // default: 1
          networkName: "Matic Mainnet",
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
          /* See Provider Options Section */ injected: {
            display: {
              name: "Default Wallet",
              description: "Connect with the provider in your Browser",
            },
            options: {
              networkParams: {
                chainId: "137", // default: 1
                networkName: "Matic Mainnet",
              },
            },
            package: null,
          },

          walletconnect: {
            package: WalletConnectProvider, // required
            options: {
              infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", // required
            },
          },
          ...newWalletProvider,
        }
      : {
          torus: {
            package: Torus, // required
            display: {
              description: "Create your wallet with torus",
            },
            options: {
              networkParams: {
                chainId: "137", // default: 1
                networkName: "Matic Mainnet",
              },
            },
          },
          sequence: {
            package: sequence, // required
            display: {
              description: "Create your wallet with sequence",
            },
            options: {
              appName: "My App", // optional
              defaultNetwork: "polygon", // optional
            },
          },
        };

    const web3Modal = new Web3Modal({
      disableInjectedProvider: !newWallet,
      network: "mainnet", // optional
      cacheProvider: false, // optional
      providerOptions, // required
      theme: "dark",
    });
    const instance = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    const Address = await signer.getAddress();
    console.log(Address);
    isUserAvaliable(Address);
    State.updateDatabase({
      walletAddress: Address,
      provider: provider,
    });
  };
}

export default useWebModal;

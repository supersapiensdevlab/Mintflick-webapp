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

  async function isUserAvaliable(walletAddress, provider) {
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`,
      data: {
        walletId: walletAddress,
      },
    })
      .then((response) => {
        console.log(response);

        State.updateDatabase({
          userData: response,
        });
        console.log("user data saved in state");
        localStorage.setItem("authtoken", response.data.jwtToken);
        console.log("auth token saved in storage");
        localStorage.setItem("walletAddress", walletAddress);
        console.log("wallet address saved in storage");
        State.updateDatabase({
          provider: provider,
        });
        console.log("provider saved in state");
        // localStorage.setItem(
        //   "v2provider",
        //   JSON.stringify(provider, getCircularReplacer())
        // );

        response.status === 200 && navigateTo("/homescreen/home");
      })
      .catch(function (error) {
        console.log(error);
        navigateTo("/create_new_user");
      });
  }
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

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
        appName: "MintFlick", // optional
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
              appName: "MintFlick", // optional
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
    console.log(provider);

    const signer = provider.getSigner();
    const Address = await signer.getAddress();
    State.updateDatabase({
      walletAddress:Address
    })
    console.log(Address);
    isUserAvaliable(Address, provider);
  };
}

export default useWebModal;

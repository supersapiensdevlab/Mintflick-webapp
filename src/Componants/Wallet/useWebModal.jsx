import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Torus from "@toruslabs/torus-embed";
import { sequence } from "0xsequence";
import { UserContext } from "../../Store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SolanaTorus from "@toruslabs/solana-embed";
import * as web3 from "@solana/web3.js";
import Main_logo from "../../Assets/logos/Main_logo";
import googleLogo from "../../Assets/logos/icons/google.svg";

import RPC from "./solanaRPC";

import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
} from "@web3auth/base";

function useWebModal() {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();
   
  const getProvider = async () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
  };

  async function isUserAvaliable(walletAddress, provider) {
    console.log(walletAddress);
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

        localStorage.setItem("provider", provider);
        State.updateDatabase({
          provider: provider,
        });
        console.log("provider saved in state");
        // localStorage.setItem(
        //   "v2provider",
        //   JSON.stringify(provider, getCircularReplacer())
        // );
        let questFlow = localStorage.getItem("questFlow");
        if (questFlow) {
          localStorage.removeItem("questFlow");
          response.status === 200 && navigateTo("/homescreen/quest-details/"+localStorage.getItem("questId"));
        }
        else{
        response.status === 200 && navigateTo("/homescreen/home");
      }
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
      display: {
        logo: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0Ij48cGF0aCBkPSJNMjIuNTYgMTIuMjVjMC0uNzgtLjA3LTEuNTMtLjItMi4yNUgxMnY0LjI2aDUuOTJjLS4yNiAxLjM3LTEuMDQgMi41My0yLjIxIDMuMzF2Mi43N2gzLjU3YzIuMDgtMS45MiAzLjI4LTQuNzQgMy4yOC04LjA5eiIgZmlsbD0iIzQyODVGNCIvPjxwYXRoIGQ9Ik0xMiAyM2MyLjk3IDAgNS40Ni0uOTggNy4yOC0yLjY2bC0zLjU3LTIuNzdjLS45OC42Ni0yLjIzIDEuMDYtMy43MSAxLjA2LTIuODYgMC01LjI5LTEuOTMtNi4xNi00LjUzSDIuMTh2Mi44NEMzLjk5IDIwLjUzIDcuNyAyMyAxMiAyM3oiIGZpbGw9IiMzNEE4NTMiLz48cGF0aCBkPSJNNS44NCAxNC4wOWMtLjIyLS42Ni0uMzUtMS4zNi0uMzUtMi4wOXMuMTMtMS40My4zNS0yLjA5VjcuMDdIMi4xOEMxLjQzIDguNTUgMSAxMC4yMiAxIDEycy40MyAzLjQ1IDEuMTggNC45M2wyLjg1LTIuMjIuODEtLjYyeiIgZmlsbD0iI0ZCQkMwNSIvPjxwYXRoIGQ9Ik0xMiA1LjM4YzEuNjIgMCAzLjA2LjU2IDQuMjEgMS42NGwzLjE1LTMuMTVDMTcuNDUgMi4wOSAxNC45NyAxIDEyIDEgNy43IDEgMy45OSAzLjQ3IDIuMTggNy4wN2wzLjY2IDIuODRjLjg3LTIuNiAzLjMtNC41MyA2LjE2LTQuNTN6IiBmaWxsPSIjRUE0MzM1Ii8+PHBhdGggZD0iTTEgMWgyMnYyMkgxeiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==",
        name: "Google",
        description: "",
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
      options: {
        appName: "MintFlick", // optional
        defaultNetwork: "polygon", // optional
      },
    },
  };

  // const newSolanaWalletProvider = {
  //   torus: {
  //     package: SolanaTorus, // required
  //     options: {
  //       networkParams: {
  //         chainId: "0x2", // default: 1
  //         networkName: "Solana Testnet",
  //       },
  //     },
  //   },
  // };

  return async function loadWebModal(newWallet, chainName) {
    if (State.database?.chainId == 0) {
      // const providerOptions = newWallet
      //   ? {
      //       /* See Provider Options Section */ injected: {
      //         display: {
      //           name: "Default Wallet",
      //           description: "Connect with the provider in your Browser",
      //         },
      //         options: {
      //           networkParams: {
      //             chainId: "0x2", // default: 1
      //             networkName: "Solana Testnet",
      //           },
      //         },
      //         package: null,
      //       },

      //       ...newSolanaWalletProvider,
      //     }
      //   : {
      //       torus: {
      //         package: SolanaTorus, // required
      //         display: {
      //           description: "Create your wallet with torus",
      //         },
      //         options: {
      //           networkParams: {
      //             chainId: "0x2", // default: 1
      //             networkName: "Solana Testnet",
      //           },
      //         },
      //       },
      //     };

      // const web3Modal = new Web3Modal({
      //   disableInjectedProvider: !newWallet,
      //   network: "mainnet", // optional
      //   cacheProvider: false, // optional
      //   providerOptions, // required
      //   theme: "dark",
      // });

      // const instance = await web3Modal.connect();
      // const provider = new ethers.providers.Web3Provider(instance);
      // console.log(provider);

      // const signer = provider.getSigner();
      // const Address = await signer.getAddress();
      // State.updateDatabase({
      //   walletAddress: Address,
      // });

      // console.log(Address);
      const provider = await getProvider();
      console.log(provider);
      if (provider) {
        try {
          const response = await provider.connect();
          const pubKey = await provider.publicKey;
          console.log(pubKey);
          const providers = provider;
          const Address = response.publicKey.toString();
          isUserAvaliable(Address, providers);
        } catch (err) {
          // { code: 4001, message: 'User rejected the request.' }
        }
      }
    } else if (State.database?.chainId == 1) {
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
                logo: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0Ij48cGF0aCBkPSJNMjIuNTYgMTIuMjVjMC0uNzgtLjA3LTEuNTMtLjItMi4yNUgxMnY0LjI2aDUuOTJjLS4yNiAxLjM3LTEuMDQgMi41My0yLjIxIDMuMzF2Mi43N2gzLjU3YzIuMDgtMS45MiAzLjI4LTQuNzQgMy4yOC04LjA5eiIgZmlsbD0iIzQyODVGNCIvPjxwYXRoIGQ9Ik0xMiAyM2MyLjk3IDAgNS40Ni0uOTggNy4yOC0yLjY2bC0zLjU3LTIuNzdjLS45OC42Ni0yLjIzIDEuMDYtMy43MSAxLjA2LTIuODYgMC01LjI5LTEuOTMtNi4xNi00LjUzSDIuMTh2Mi44NEMzLjk5IDIwLjUzIDcuNyAyMyAxMiAyM3oiIGZpbGw9IiMzNEE4NTMiLz48cGF0aCBkPSJNNS44NCAxNC4wOWMtLjIyLS42Ni0uMzUtMS4zNi0uMzUtMi4wOXMuMTMtMS40My4zNS0yLjA5VjcuMDdIMi4xOEMxLjQzIDguNTUgMSAxMC4yMiAxIDEycy40MyAzLjQ1IDEuMTggNC45M2wyLjg1LTIuMjIuODEtLjYyeiIgZmlsbD0iI0ZCQkMwNSIvPjxwYXRoIGQ9Ik0xMiA1LjM4YzEuNjIgMCAzLjA2LjU2IDQuMjEgMS42NGwzLjE1LTMuMTVDMTcuNDUgMi4wOSAxNC45NyAxIDEyIDEgNy43IDEgMy45OSAzLjQ3IDIuMTggNy4wN2wzLjY2IDIuODRjLjg3LTIuNiAzLjMtNC41MyA2LjE2LTQuNTN6IiBmaWxsPSIjRUE0MzM1Ii8+PHBhdGggZD0iTTEgMWgyMnYyMkgxeiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==",
                description: "Create your wallet with torusss",
              },
              options: {
                showTorusButton: true,
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
        cacheProvider: true, // optional
        providerOptions, // required
        theme: "dark",
      });

      let instance;
      if(web3Modal.cachedProvider)
      instance = await web3Modal.connect();
      else 
      instance = await web3Modal.connect();

      localStorage.setItem("web3Modal", web3Modal);
      State.updateDatabase({
        web3Modal: web3Modal,
      });

      
      const provider = new ethers.providers.Web3Provider(instance);
      console.log("PROVIDER:", provider);
      const signer = provider.getSigner();
      console.log("SIGNER:", signer);
      const Address = await signer.getAddress();
      State.updateDatabase({
        walletAddress: Address,
      });

      console.log(Address);
      isUserAvaliable(Address, provider);
      provider.on("connect", (chainId) => {
        console.log(chainId);
      });
    }
  };
}

export default useWebModal;

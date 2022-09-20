import React, { useContext, useEffect, useState } from "react";
import useWebModal from "./../Componants/Wallet/useWebModal";
import { Web3Auth } from "@web3auth/web3auth";
import RPC from "./../Componants/Wallet/solanaRPC";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";
import { loadOptions } from "@babel/core";
import { UserContext } from "../Store";

export default function useWeb3Auth() {
  const modal = useWebModal();
  const clientId =
    "BDHO2TAO1JeWQqhvAdqA40Fzjixs_sEf-yXhp-QAK3MfnUclbzYHRsE_BvG9F5cmDopDkGV3LJ1n-nR7Ohtn_wc";
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const State = useContext(UserContext);
  const navigateTo = useNavigate();

  const init = async () => {
    console.log("init called");
    try {
      const web3auth = new Web3Auth({
        clientId,
        chainConfig: {
          chainNamespace:
            State.database.chainId === 0
              ? CHAIN_NAMESPACES.SOLANA
              : CHAIN_NAMESPACES.EIP155,
          chainId: State.database.chainId === 0 ? "0x1" : "0x89",
          rpcTarget:
            State.database.chainId === 0
              ? process.env.REACT_APP_SOLANA_RPC
              : "https://rpc.ankr.com/polygon", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          displayName: "Polygon Mainnet",
          blockExplorer: "https://polygonscan.com",
          ticker: "MATIC",
          tickerName: "Matic",
        },
        uiConfig: {
          theme: "dark",
          loginMethodsOrder: ["facebook", "google"],
          appLogo:
            "https://ipfs.io/ipfs/bafybeihshcxswtnebaobbgjdvqgam6ynr676gcmbq3ambsg4aznytv3dwi/Mintflick%20icon-12%20%281%29.png", // Your App Logo Here
        },
      });
      if (State.database.chainId !== 0) {
        const torusWalletAdapter = new TorusWalletAdapter({
          adapterSettings: {
            buttonPosition: "bottom-left",
          },
          loginSettings: {
            verifier: "google",
          },
          initParams: {
            buildEnv: "testing",
          },
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x3",
            rpcTarget:
              "https://ropsten.infura.io/v3/776218ac4734478c90191dde8cae483c",
            displayName: "ropsten",
            blockExplorer: "https://ropsten.etherscan.io/",
            ticker: "ETH",
            tickerName: "Ethereum",
          },
          clientId: clientId,
        });
        web3auth.configureAdapter(torusWalletAdapter);
      }

      setWeb3auth(web3auth);
      await web3auth.initModal({
        modalConfig: {
          [WALLET_ADAPTERS.OPENLOGIN]: {
            label: "openlogin",
            loginMethods: {
              reddit: {
                showOnModal: false,
                name: "reddit",
              },
            },
          },
        },
      });

      if (web3auth.provider) {
        setProvider(web3auth.provider);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    init();
    console.log("use called");
    loadOptions();
  }, [State.database.chainId]);

  useEffect(() => {
    getAccounts();
    console.log(provider);
    console.log("get called");
  }, [provider]);

  async function isUserAvaliable(walletAddress, provider) {
    if (
      provider ||
      !provider === null ||
      !provider === undefined ||
      !provider === "undefined"
    ) {
      await axios({
        method: "post",
        url: `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`,
        data: {
          walletId: walletAddress,
        },
      })
        .then((response) => {
          console.log(response);

          console.log("user data saved in state");
          localStorage.setItem("authtoken", response.data.jwtToken);
          console.log("auth token saved in storage");
          localStorage.setItem("walletAddress", walletAddress);
          console.log("wallet address saved in storage");
          State.updateDatabase({
            provider: provider,
            userData: response,
          });
          console.log("provider saved in state");
          console.log(web3auth.provider);
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
  }
  const getAccounts = async () => {
    if (
      !provider ||
      provider === null ||
      provider === undefined ||
      provider === "undefined"
    ) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    let address = (await rpc.getAccounts())[0];

    if (State.database.chainId === 1) {
      const web3 = new Web3(provider); // web3auth.provider
      // Get user's Ethereum public address
      address = (await web3.eth.getAccounts())[0];
      console.log("Polygon:", address);
    }
    State.updateDatabase({
      walletAddress: address,
    });
    console.log(address, State.database.chainId);
    isUserAvaliable(address, provider);
  };

  const login = async () => {
    console.log("login called");
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    State.updateDatabase({
      provider: web3authProvider,
    });
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  return [login, logout];
}

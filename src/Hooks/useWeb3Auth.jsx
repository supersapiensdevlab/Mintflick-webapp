import React, { useContext, useEffect, useState } from "react";
// import useWebModal from "./../Componants/Wallet/useWebModal";
import { Web3Auth } from "@web3auth/modal";
import RPC from "./../Componants/Wallet/solanaRPC";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";
import { loadOptions } from "@babel/core";
import { UserContext } from "../Store";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { OPENLOGIN_NETWORK_TYPE } from "@web3auth/base";

export default function useWeb3Auth() {
  // const modal = useWebModal();
  let clientId = `BIkayaVZreEWb-twRX4WscaqXcBJ0j9shAdTmUVp4Zzj5bKNkhQ2_NNd7g3nyoWmRJk9t5cPO9rUNQn-byPmEMs`;
  // if (process.env.REACT_APP_PRODUCTION == "false") {
  //   clientId = `${process.env.REACT_APP_WEB3AUTH_TESTNET_CLIENT_ID}`;
  // } else {
  //   clientId = `${process.env.REACT_APP_WEB3AUTH_MAINNET_CLIENT_ID}`;
  // }
  // const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const State = useContext(UserContext);
  const navigateTo = useNavigate();
  const redirectLocation = useLocation();
  const web3auth = new Web3Auth({
    clientId,
    chainConfig: {
      chainNamespace:
        State.database.chainId == 0
          ? CHAIN_NAMESPACES.SOLANA
          : CHAIN_NAMESPACES.EIP155,
      chainId: "0x2",
      rpcTarget:
        State.database.chainId == 0
          ? process.env.REACT_APP_SOLANA_RPC
          : "https://rpc.ankr.com/polygon", // This is the public RPC we have added, please pass on your own endpoint while creating an app
      displayName:
        State.database.chainId === 0 ? "Solana Testnet" : "Polygon Mainnet",
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
          chainId: State.database.chainId === 0 ? "0x2" : "0x89",
          rpcTarget:
            State.database.chainId === 0
              ? process.env.REACT_APP_SOLANA_RPC
              : "https://rpc.ankr.com/polygon", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          displayName:
            State.database.chainId === 0 ? "Solana Testnet" : "Polygon Mainnet",
          blockExplorer:
            State.database.chainId === 0
              ? "https://explorer.solana.com"
              : "https://polygonscan.com",
          ticker: State.database.chainId === 0 ? "SOL" : "MATIC",
          tickerName: State.database.chainId === 0 ? "Solana" : "Matic",
        },
        uiConfig: {
          theme: "dark",
          loginMethodsOrder: ["facebook", "google"],
          appLogo:
            "https://ipfs.io/ipfs/bafybeihshcxswtnebaobbgjdvqgam6ynr676gcmbq3ambsg4aznytv3dwi/Mintflick%20icon-12%20%281%29.png", // Your App Logo Here
        },
      });
      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          network: "testnet",
          uxMode: "popup",
          whiteLabel: {
            name: "Mintflick",
            logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
            logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
            defaultLanguage: "en",
            dark: true, // whether to enable dark mode. defaultValue: false
          },
        },
      });
      web3auth.configureAdapter(openloginAdapter);
      console.log(web3auth);
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
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   init();
  //   console.log("use called");
  //   loadOptions();
  // }, [State.database.chainId]);

  useEffect(() => {
    console.log("RedirectTo", redirectLocation.pathname);
    init();
    console.log("use called");
  }, []);
  async function isUserAvaliable(walletAddress) {
    if (
      web3auth.provider ||
      !web3auth.provider === null ||
      !web3auth.provider === undefined ||
      !web3auth.provider === "undefined"
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
            provider: web3auth.provider,
            userData: response,
          });
          console.log("provider saved in state");
          console.log(web3auth.provider);

          if (
            localStorage.getItem("walletAddress") !== null &&
            localStorage.getItem("walletAddress") !== "undefined" &&
            localStorage.getItem("walletAddress") !== "null" &&
            localStorage.getItem("walletAddress").length > 0
          ) {
            response.status === 200 &&
              navigateTo(
                redirectLocation.pathname !== "/"
                  ? redirectLocation.pathname
                  : "/homescreen/home"
              );
          }
        })
        .catch(function (error) {
          console.log(error);

          navigateTo("/create_new_user");
        });
    }
  }
  const getAccounts = async () => {
    if (
      !web3auth.provider ||
      web3auth.provider === null ||
      web3auth.provider === undefined ||
      web3auth.provider === "undefined" ||
      web3auth.provider === "null" ||
      web3auth.provider.length === 0
    ) {
      console.log("provider not initialized yet");
      return;
    }

    if (web3auth.provider) {
      setProvider(web3auth.provider);
      if (State.database.chainId === 1) {
        const web3 = new Web3(web3auth.provider); // web3auth.provider
        // Get user's Ethereum public address
        let address = (await web3.eth.getAccounts())[0];
        console.log("Polygon:", address);
        State.updateDatabase({
          walletAddress: address,
        });
        isUserAvaliable(address, web3auth.provider);
      } else if (State.database.chainId === 0) {
        const rpc = new RPC(web3auth.provider);
        let address = (await rpc.getAccounts())[0];
        State.updateDatabase({
          walletAddress: address,
        });
        console.log(address, State.database.chainId);
        isUserAvaliable(address, web3auth.provider);
      }
    }
  };

  const login = async () => {
    console.log("login called");
    if (
      !web3auth ||
      web3auth === null ||
      web3auth === undefined ||
      web3auth === "undefined" ||
      web3auth === "null" ||
      web3auth.length === 0
    ) {
      console.log("web3auth not initialized yet");
      await init();
      return;
    }
    // setWeb3auth(web3auth);
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

    // if (web3auth.provider) {
    //   setProvider(web3auth.provider);
    //   State.updateDatabase({
    //     provider: web3auth.provider,
    //   });
    // }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    console.log(web3authProvider);
    State.updateDatabase({
      provider: web3authProvider,
    });
    getAccounts();
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    State.updateDatabase({
      provider: null,
    });
    setProvider(null);
  };

  return [login, logout];
}

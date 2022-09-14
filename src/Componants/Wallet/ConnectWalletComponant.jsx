import React, { useContext, useEffect, useState } from "react";
import useWebModal from "./useWebModal";
import metamask from "../../Assets/logos/wallet/metamask.png";
import walletConnect from "../../Assets/logos/wallet/walletConnect.png";
import torus from "../../Assets/logos/wallet/torus.png";
import sequence from "../../Assets/logos/wallet/sequence.svg";
import { UserContext } from "../../Store";
import PolygonToken from "../../Assets/logos/PolygonToken";
import SolanaToken from "../../Assets/logos/SolanaToken";
import { Web3Auth } from "@web3auth/web3auth";
import RPC from "./solanaRPC";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";

import { WALLET_ADAPTERS } from "@web3auth/base";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import Main_logo from "../../Assets/logos/Main_logo";
import Web3 from "web3";

function ConnectWalletComponant() {
  const modal = useWebModal();
  const wallets = [metamask, walletConnect, torus, sequence];
  const [selectedChain, setSelectedChain] = useState(0);
  const clientId =
    "BDHO2TAO1JeWQqhvAdqA40Fzjixs_sEf-yXhp-QAK3MfnUclbzYHRsE_BvG9F5cmDopDkGV3LJ1n-nR7Ohtn_wc";
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const State = useContext(UserContext);
  const navigateTo = useNavigate();

  const initWeb3Auth = async () => {
    try {
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

      const web3auth = new Web3Auth({
        clientId,
        chainConfig: {
          chainNamespace:
            selectedChain === 0
              ? CHAIN_NAMESPACES.SOLANA
              : CHAIN_NAMESPACES.EIP155,
          chainId: selectedChain === 0 ? "0x1" : "0x89",
          rpcTarget:
            selectedChain === 0
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
      web3auth.configureAdapter(torusWalletAdapter);

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
    initWeb3Auth();
  }, [selectedChain]);

  useEffect(() => {
    if (provider) {
      provider.on("accountsChanged", (accounts) => {
        console.log("accountsChanged", accounts);
      });
      provider.on("chainChanged", (chainId) => {
        console.log("chainChanged", chainId);
      });
      provider.on("disconnect", (error) => {
        console.log("disconnect", error);
      });
      console.log(provider);

      getAccounts();
    }
  }, [provider]);
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
  const getAccounts = async () => {
    if (!provider) {
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
  return (
    <div
      className="flex flex-col justify-start w-fit lg:w-1/2 space-y-6 p-6
      lg:p-12 bg-texture bg-repeat"
    >
      <p className="text-5xl font-bold text-brand-gradient">Connect Wallet</p>
      <p className="text-brand4 text-lg font-medium">
        <p className="text-xl font-semibold text-brand2">What is wallet?</p>
        Crypto wallets store your private keys, keeping your crypto safe and
        accessible. They also allow you to send, receive, and spend
        cryptocurrencies like Bitcoin and Ethereum.
      </p>
      <p className="text-brand4 text-lg font-medium">
        Connect your crypto wallet to mint your NFT's in Mintflick.If you do not
        have a wallet then just create one.
      </p>
      <div className="w-full flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-10">
        <button
          onClick={async () => {
            const web3authProvider = await web3auth.connect();
            setProvider((prev) => web3authProvider);
          }}
          className="btn btn-brand sm:w-1/2"
        >
          Connect wallet
        </button>
        {/* <button onClick={getUserInfo} className="card">
          Get User Info
        </button> */}
        <button
          onClick={async () => {
            const web3authProvider = await web3auth.connect();

            setProvider((prev) => web3authProvider);
          }}
          className="btn btn-outline btn-primary sm:w-1/2"
        >
          Create new wallet
        </button>
      </div>
      <div className="form-control w-fit  ">
        <label className="label cursor-pointer gap-4">
          <span className="label-text text-white">Switch Chains</span>
          <SolanaToken
            className={State.database.chainId === 1 ? "saturate-0" : null}
          />
          <input
            type="checkbox"
            className="toggle bg-brand"
            onChange={() => {
              let _selectedChain = selectedChain === 0 ? 1 : 0;
              setSelectedChain(_selectedChain);
              State.updateDatabase({
                chainId: _selectedChain,
              });
            }}
          />
          <PolygonToken className={selectedChain === 0 ? "saturate-0" : null} />
        </label>
      </div>
      <div className="w-full md:w-fit border p-4 space-y-2 rounded-lg border-slate-800">
        <p className="text-lg font-medium text-brand4">Supported Wallets</p>
        <div className="w-full flex flex-wrap justify-between md:space-x-2">
          {wallets.map((wallet, i) => (
            <img
              key={i}
              className="h-16 w-16 bg-slate-800 rounded-full p-2"
              src={wallet}
              alt="wallet"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ConnectWalletComponant;

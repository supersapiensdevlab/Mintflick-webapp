import React from "react";
import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/web3auth";
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
} from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import RPC from "./solanaRPC";

const clientId =
  "BDHO2TAO1JeWQqhvAdqA40Fzjixs_sEf-yXhp-QAK3MfnUclbzYHRsE_BvG9F5cmDopDkGV3LJ1n-nR7Ohtn_wc"; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.SOLANA,
            chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
            rpcTarget: "https://rpc.ankr.com/solana", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
          uiConfig: {
            theme: "dark",
            loginMethodsOrder: ["facebook", "google"],
            appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
          },
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            clientId,
            network: "testnet",
            // uxMode: "popup",
            // whiteLabel: {
            //   name: "Your app Name",
            //   logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
            //   logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
            //   defaultLanguage: "en",
            //   dark: true, // whether to enable dark mode. defaultValue: false
            // },
          },
        });
        web3auth.configureAdapter(openloginAdapter);
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

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    console.log("web3authProvider", web3authProvider);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    console.log(address);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    console.log(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    console.log(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    console.log(signedMessage);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    console.log(privateKey);
  };
  const loggedInView = (
    <>
      <div onClick={getUserInfo} className="card btn w-fit">
        Get User Info
      </div>
      <div onClick={getAccounts} className="card btn w-fit">
        Get Accounts
      </div>
      <div onClick={getBalance} className="card btn w-fit">
        Get Balance
      </div>
      <div onClick={sendTransaction} className="card btn w-fit">
        Send Transaction
      </div>
      <div onClick={signMessage} className="card btn w-fit">
        Sign Message
      </div>
      <div onClick={getPrivateKey} className="card btn w-fit">
        Get Private Key
      </div>
      <div onClick={logout} className="card btn w-fit">
        Log Out
      </div>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <div onClick={login} className="card btn w-fit">
      Login
    </div>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth
        </a>
        ReactJS Example
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/Web3Auth/tree/master/examples/react-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;

import React from "react";
import useWebModal from "./useWebModal";
import metamask from "../../Assets/logos/wallet/metamask.png";
import walletConnect from "../../Assets/logos/wallet/walletConnect.png";
import torus from "../../Assets/logos/wallet/torus.png";
import sequence from "../../Assets/logos/wallet/sequence.svg";
import { UserContext } from "../../Store";

function ConnectWalletComponant() {
  const modal = useWebModal();
  const wallets = [metamask, walletConnect, torus, sequence];

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
          onClick={() => {
            modal(true);
          }}
          className="btn btn-brand sm:w-1/2"
        >
          Connect wallet
        </button>
        <button
          onClick={() => {
            modal(false);
          }}
          className="btn btn-outline btn-primary sm:w-1/2"
        >
          Create new wallet
        </button>
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

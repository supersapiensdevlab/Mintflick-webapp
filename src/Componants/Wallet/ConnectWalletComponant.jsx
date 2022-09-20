import React, { useContext, useEffect, useState } from "react";
import metamask from "../../Assets/logos/wallet/metamask.png";
import walletConnect from "../../Assets/logos/wallet/walletConnect.png";
import torus from "../../Assets/logos/wallet/torus.png";
import sequence from "../../Assets/logos/wallet/sequence.svg";
import { UserContext } from "../../Store";
import PolygonToken from "../../Assets/logos/PolygonToken";
import SolanaToken from "../../Assets/logos/SolanaToken";
import useWeb3Auth from "../../Hooks/useWeb3Auth";

function ConnectWalletComponant() {
  const wallets = [metamask, walletConnect, torus, sequence];
  const State = useContext(UserContext);

  const [login, logout] = useWeb3Auth();

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
            await login();
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
            login();
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
            checked={State.database.chainId === 0 ? false : true}
            onChange={() => {
              let _selectedChain = State.database.chainId === 0 ? 1 : 0;
              State.updateDatabase({
                chainId: _selectedChain,
              });
            }}
          />
          <PolygonToken
            className={State.database.chainId === 0 ? "saturate-0" : null}
          />
          {/* {switching ? (
            <button class='btn btn-ghost btn-square loading'></button>
          ) : null} */}
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

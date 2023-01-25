import React, { useContext, useEffect, useState } from "react";
import twitter from "../../Assets/logos/wallet/twitter.svg";
import discord from "../../Assets/logos/wallet/discord.svg";
import telegram from "../../Assets/logos/wallet/telegram.svg";
import instagram from "../../Assets/logos/wallet/instagram.svg";
import { UserContext } from "../../Store";
import PolygonToken from "../../Assets/logos/PolygonToken";
import SolanaToken from "../../Assets/logos/SolanaToken";
import useWeb3Auth from "../../Hooks/useWeb3Auth";
import { Rocket } from "tabler-icons-react";
import Emoji from "react-emojis";
import useWebModal from "./useWebModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function ConnectWalletComponant() {
  const wallets = [twitter, discord, instagram];
  const links = [
    "https://twitter.com/mintflickApp",
    "https://discord.com/invite/xZavZyAbx4",
    "https://www.instagram.com/mintflick.app/",
  ];

  const State = useContext(UserContext);
  const navigateTo = useNavigate();

  // const [login, logout] = useWeb3Auth();
  const modal = useWebModal();

  async function isUserAvaliable(walletAddress, provider) {
    console.log("Checking for User with Wallet:", walletAddress);
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

        // localStorage.setItem("provider", provider);
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
          response.status === 200 &&
            navigateTo(
              "/homescreen/quest-details/" + localStorage.getItem("questId")
            );
        } else {
          response.status === 200 && navigateTo("/homescreen/home");
        }
      })
      .catch(function (error) {
        console.log(error);
        State.updateDatabase({
          provider: provider,
        });
        navigateTo("/create_new_user");
      });
  }

  const handlePhantomConnect = () => {
    window.phantom.solana
      .connect()
      .then(console.log(window.phantom.solana.publicKey.toBase58()));
    let address = window.phantom.solana.publicKey.toBase58();
    State.updateDatabase({
      walletAddress: address,
    });
    isUserAvaliable(address, window.phantom.solana);
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
        Connect your crypto wallet to mint your NFTs on Mintflick. If you do not
        have a wallet then click below to create one or login into existing.
      </p>
      {State.database.chainId === 1 && (
        <button
          onClick={async () => {
            modal(true);
          }}
          className="btn btn-brand w-full capitalize gap-1"
        >
          Let me In &nbsp;
          <Emoji emoji="rocket" />
        </button>
      )}
      {/* <button onClick={getUserInfo} className="card">
          Get User Info
        </button> */}
      {State.database.chainId === 0  && (
        <button
          onClick={async () => {
            modal(true);
          }}
          className="btn btn-brand w-full capitalize gap-2"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 399 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="399" height="400" rx="111" fill="#012BE7" />
            <rect x="154" y="91" width="65" height="218" rx="20" fill="white" />
            <rect x="98" y="91" width="121" height="65" rx="20" fill="white" />
            <rect
              x="235"
              y="91"
              width="65"
              height="65"
              rx="32.5"
              fill="white"
            />
          </svg>
          Connect Torus Wallet
        </button>
      )}
      {State.database.chainId === 0 && window.phantom && (
        <button
          onClick={() => {
            handlePhantomConnect();
          }}
          className="btn btn-brand w-full capitalize gap-2"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 128 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="64" cy="64" r="64" fill="url(#paint0_linear)" />
            <path
              d="M110.584 64.9142H99.142C99.142 41.7651 80.173 23 56.7724 23C33.6612 23 14.8716 41.3057 14.4118 64.0583C13.936 87.577 36.241 108 60.0186 108H63.0094C83.9723 108 112.069 91.7667 116.459 71.9874C117.27 68.3413 114.358 64.9142 110.584 64.9142ZM39.7689 65.9454C39.7689 69.0411 37.2095 71.5729 34.0802 71.5729C30.9509 71.5729 28.3916 69.0399 28.3916 65.9454V56.8414C28.3916 53.7457 30.9509 51.2139 34.0802 51.2139C37.2095 51.2139 39.7689 53.7457 39.7689 56.8414V65.9454ZM59.5224 65.9454C59.5224 69.0411 56.9631 71.5729 53.8338 71.5729C50.7045 71.5729 48.1451 69.0399 48.1451 65.9454V56.8414C48.1451 53.7457 50.7056 51.2139 53.8338 51.2139C56.9631 51.2139 59.5224 53.7457 59.5224 56.8414V65.9454Z"
              fill="url(#paint1_linear)"
            />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="64"
                y1="0"
                x2="64"
                y2="128"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#534BB1" />
                <stop offset="1" stop-color="#551BF9" />
              </linearGradient>
              <linearGradient
                id="paint1_linear"
                x1="65.4998"
                y1="23"
                x2="65.4998"
                y2="108"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" />
                <stop offset="1" stop-color="white" stop-opacity="0.82" />
              </linearGradient>
            </defs>
          </svg>
          Connect Phantom wallet
        </button>
      )}
      {/* <div className="flex text-white align-middle text-center gap-x-2">
        Supports <SolanaToken size={24}></SolanaToken>
      </div> */}
      <div className="form-control w-fit ">
        <label className="label cursor-pointer gap-4">
          <span className="label-text text-white">Switch Chains</span>
          <SolanaToken
            className={State.database.chainId === 1 ? "saturate-0" : null}
          />
          <input
            type="checkbox"
            className="toggle bg-brand "
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
          {/* {switching ? ( */}
          {/* <button class="btn btn-ghost btn-square loading"></button> */}
          {/* ) : null} */}
        </label>
      </div>
      <div className="w-full md:w-fit border p-4 space-y-2 rounded-lg border-slate-800">
        <p className="text-lg font-medium text-brand4">
          Join the MintFlick community
        </p>
        <div className="w-full flex flex-wrap justify-between md:space-x-2">
          {wallets.map((wallet, i) => (
            <a href={links[i]} target="_blank" rel="noreferrer">
              <img
                key={i}
                className="h-16 w-16 bg-slate-800 rounded-full p-3 text-white"
                src={wallet}
                alt="wallet"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ConnectWalletComponant;

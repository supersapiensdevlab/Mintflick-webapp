import axios from "axios";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Store";
import SolanaTorus from "@toruslabs/solana-embed";
import googleLogo from "../../Assets/logos/icons/google.svg";
import connectwallet from "../../Assets/connect-wallet.webp";

function ConnectWalletModal() {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();

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
        console.log("user data", response);

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
      })
      .catch(async function (error) {
        console.log(error);
        State.updateDatabase({
          provider: provider,
        });
        error.response.status === 404 && navigateTo("/create_new_user");
        error.response.status === 0 && State.toast(error.message);
      });
  }

  const handlePhantomConnect = () => {
    window.phantom.solana
      .connect()
      .then(console.log(window.phantom.solana.publicKey.toBase58()));
    let address = window.phantom.solana.publicKey.toBase58();
    State.updateDatabase({
      walletAddress: address,
      walletProvider: "phantom",
    });
    isUserAvaliable(address, window.phantom.solana);
    console.log(window.phantom.solana);
  };

  const handleTorusConnect = async () => {
    const torus = new SolanaTorus();
    await torus.init();
    await torus.login();

    console.log("torus", torus);
    const address = torus.provider.selectedAddress;
    State.updateDatabase({
      walletAddress: address,
      walletProvider: "torus",
    });
    isUserAvaliable(address, torus);
  };

  return (
    <div className="absolute bottom-0 left-0 z-[999] w-screen h-screen p-2 flex justify-center items-end sm:items-center  bg-black/30 backdrop-blur-sm">
      <div className="relative flex flex-col items-center bg-white dark:bg-slate-900 w-full   sm:max-w-xl  h-fit  rounded-lg overflow-hidden">
        <img
          className="w-full aspect-video object-cover"
          src={connectwallet}
          alt="wallet"
        />
        <div className="flex-grow p-8 flex flex-col items-center gap-4">
          <span className="text-4xl font-bold text-brand1">
            Wallet disconnected!
          </span>
          {State.database.chainId === 0 && (
            <div className="flex flex-col w-full">
              {window.phantom && (
                <button
                  onClick={() => {
                    handlePhantomConnect();
                  }}
                  className={`w-full flex items-center justify-center gap-2 font-semibold text-lg mt-4  p-4 rounded-lg  
               text-brand1 bg-primary
             
            `}
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
                        <stop
                          offset="1"
                          stop-color="white"
                          stop-opacity="0.82"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                  Connect Phantom wallet
                </button>
              )}

              <button
                onClick={() => handleTorusConnect()}
                className={`w-full flex items-center justify-center gap-2 font-semibold text-lg mt-4  p-4 rounded-lg  
               text-brand1 bg-primary
             
            `}
              >
                <img
                  src={googleLogo}
                  className="h-6 w-6 p-0 rounded-full bg-white"
                />{" "}
                Continue with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConnectWalletModal;

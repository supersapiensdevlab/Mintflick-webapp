import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowBarToRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Copy,
  X,
} from "tabler-icons-react";
import { UserContext } from "../../Store";

function SplashScreen(props) {
  const [active, setactive] = useState(0);
  console.log(props.data);

  function handleClick() {
    active < props.data.length - 1 ? setactive(active + 1) : props.func();
  }
  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center  bg-black/30 backdrop-blur-sm">
        <div className="relative flex flex-col items-center bg-white dark:bg-slate-900 w-full h-full sm:max-w-xl sm:h-5/6 sm:rounded-lg overflow-hidden">
          {active !== 0 && (
            <button
              onClick={() => setactive(active - 1)}
              className="flex items-center gap-2 absolute top-4  left-4 font-semibold text-lg text-brand1"
            >
              <ChevronLeft />
              Back
            </button>
          )}{" "}
          {active !== props.data.length - 1 && (
            <button
              onClick={() => setactive(props.data.length - 1)}
              className="absolute top-4 right-4 font-semibold text-lg text-brand1"
            >
              Skip
            </button>
          )}
          <img
            className="w-full h-1/2 sm:aspect-video object-cover"
            src={props.data[active].image}
            alt="wallet"
          />
          <div className="flex-grow p-8 flex flex-col items-start gap-4">
            <span className="text-4xl font-bold text-brand1">
              {props.data[active].heading}
            </span>
            <p className="text-md font-semibold text-slate-400 flex-grow">
              {props.data[active].text}
            </p>

            <button
              onClick={handleClick}
              className={`w-full flex items-center justify-center gap-2 font-semibold text-lg  p-4 rounded-lg ${
                active === props.data.length - 1
                  ? `text-brand1 bg-primary`
                  : `text-primary border-2 border-primary`
              }`}
            >
              {active === props.data.length - 1 ? "Finish" : "Next"}
              {active !== props.data.length - 1 && <ChevronRight />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function CreateNewUser() {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();
  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [loader, setloader] = useState(false);
  const [error, seterror] = useState(false);
  const [showSplash, setshowSplash] = useState(false);

  const SlashScreenData = [
    {
      image: "https://miro.medium.com/max/1400/1*nbk1cvZBk4xxOMLJJnc7Ow.png",
      heading: "NFTfied Social Media",
      text: (
        <>
          💸 Marketplaces are place of business & Social Media is a place to
          connect & Interact.
          <br />
          🤑 We infused them together into an unique blend where creators can
          sell their Day-to-Day Posts & make a living out of.
        </>
      ),
    },
    {
      image:
        "https://www.shutterstock.com/image-vector/web-30-new-generation-internet-260nw-2160127645.jpg",
      heading: "Livestreaming",
      text: (
        <>
          🎮 Connect with your Audience & Stream live concerts, Gameplays &
          Metaverse Events.
          <br />
          💰 Mint NFTs from Livestreams so you can monetise your Best moments.
        </>
      ),
    },
    {
      image:
        "https://www.shutterstock.com/image-vector/web-30-text-on-hologram-260nw-2083690645.jpg",
      heading: "Events",
      text: (
        <>
          🎟️ Booking & Hosting Events has never been this easy. Book Token gated
          tickets for Local Events, Web3 Meetups - NFT Ticket will be added to
          your wallet.
          <br />
          🗓️ Host your Events & invite your audience with an easy to Go
          Experience.
        </>
      ),
    },
  ];

  async function createNewUser(walletAddress) {
    setshowSplash(false);
    setloader(true);
    console.log(walletAddress);
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`,
      data: {
        walletId: walletAddress,
        email: email,
        name: name,
      },
    })
      .then((response) => {
        console.log(response);
        if (response.data == "Email") {
          seterror("Email Already Exists");
          setloader(false);
        } else {
          State.updateDatabase({
            userData: response,
          });
          console.log("user data saved in state");
          localStorage.setItem("authtoken", response.data.jwtToken);
          console.log("auth token saved in storage");
          localStorage.setItem("walletAddress", walletAddress);
          console.log("wallet address saved in storage");
          setloader(false);
          seterror("");
          let questId = localStorage.getItem("questId");

          if (questId && localStorage.getItem("taskId")) {
            localStorage.setItem("questFlow", false);
            navigateTo("/quest-details/" + questId);
          } else {
            navigateTo("/homescreen/home");
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        seterror("Server error");
        setloader(false);
        error.response.status === 400 && seterror("Invalid Email");
      });
  }

  async function getEmailAndName() {
    const userInfo =
      State.database.walletProvider === "torus" &&
      (await State.database.provider.getUserInfo());
    State.database.walletProvider === "torus" && setname(userInfo.name);
    State.database.walletProvider === "torus" && setemail(userInfo.email);
  }

  useEffect(() => {
    getEmailAndName();
  }, []);

  return (
    <>
      <div className="flex flex-col justify-start w-fit lg:w-1/2 space-y-6 p-6 lg:p-12">
        <div className="w-full flex items-center  max-w-3xl mx-auto">
          <button
            onClick={() => {
              navigateTo("../");
              State.database.walletProvider === "torus" &&
                State.database.provider.logout();
            }}
            className="flex justify-center items-center text-brand3 font-semibold"
          >
            <ChevronLeft />
            Back
          </button>
        </div>{" "}
        <p className="text-5xl font-bold text-brand-gradient">Create Account</p>
        <div className="text-brand4 text-lg font-medium">
          <p className="text-xl font-semibold text-brand2 flex items-center gap-2">
            {State.database.walletAddress?.slice(0, 6) +
              "..." +
              State.database.walletAddress?.slice(-4)}
            <Copy
              onClick={() => {
                navigator.clipboard.writeText(State.database.walletAddress);
                State.toast("success", "Wallet Address Copied!");
              }}
              color="green"
              className="tooltip"
              data-tip="Copy "
            />
          </p>
          This wallet address will link to your email id.
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            name && email && State.database.walletAddress
              ? setshowSplash(true)
              : seterror("Enter Name and Email!");
          }}
          className="w-full max-w-lg flex flex-col  space-y-4   pt-4"
        >
          {error && (
            <div className="flex justify-between items-center p-3 bg-rose-600 text-slate-100 rounded-lg font-mediumtext-sm">
              <div className="flex items-center gap-4">
                <AlertTriangle></AlertTriangle> {error}
              </div>
              <X
                className="cursor-pointer"
                onClick={() => seterror("")}
                size={16}
              ></X>
            </div>
          )}
          <input
            value={name}
            onChange={(e) => setname(e.target.value)}
            placeholder="Name"
            className="input w-full"
          />
          <input
            value={email}
            readOnly={State.database.walletProvider === "torus"}
            onChange={(e) => setemail(e.target.value)}
            placeholder="Email"
            className="input w-full "
          />
          <button
            type="submit"
            className={`btn  w-full ${loader ? "loading" : "btn-brand"}`}
          >
            Create Account
          </button>
        </form>
      </div>
      {showSplash && (
        <SplashScreen
          data={SlashScreenData}
          func={() => createNewUser(State.database.walletAddress)}
        />
      )}
    </>
  );
}

export default CreateNewUser;

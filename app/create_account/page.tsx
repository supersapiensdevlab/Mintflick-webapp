"use client";
import Button from "@/components/molecules/Button";
import Divider from "@/components/molecules/Divider";
import FullScreenOverlay from "@/components/molecules/FullScreenOverlay";
import FullscreenContainer from "@/components/molecules/FullscreenContainer";
import TextInput from "@/components/molecules/TextInput";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import livestream from "@/public/livestream.webp";
import tickets from "@/public/tickets.webp";
import social from "@/public/social.webp";
import CopyToClipboard from "@/components/molecules/CopyButton";
import { UserContext } from "@/contexts/userContext";
import { walletProviderContext } from "@/contexts/walletProviderContext";
import { toastContext } from "@/contexts/toastContext";

const SplashScreenData = [
  {
    image: social,
    heading: "NFTfied Social Media",
    text: (
      <>
        💸 Marketplaces are place of business & Social Media is a place to
        connect & Interact.
        <br />
        🤑 We infused them together into an unique blend where creators can sell
        their Day-to-Day Posts & make a living out of.
      </>
    ),
  },
  {
    image: livestream,
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
    image: tickets,
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

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const userState = useContext(UserContext);
  const toastState = useContext(toastContext);
  const [walletAddress, setWalletAddress] = useState("");
  const walletProvider = useContext(walletProviderContext);

  const [email, setEmail] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState(1);

  async function getEmailAndName() {
    const userInfo = await walletProvider.solanaProvider.getUserInfo();
    setUsername(userInfo.name);
    setEmail(userInfo.email);
    setWalletAddress(walletProvider.solanaProvider.provider.selectedAddress);
  }

  useEffect(() => {
    getEmailAndName();
    console.log("render");
  }, []);

  return (
    <FullscreenContainer className="flex flex-col items-start justify-between max-w-lg mx-auto overflow-hidden sm:gap-6 sm:justify-start bg-vapormintBlack-300">
      <div className="flex flex-col w-full gap-6 p-4 h-fit">
        <div className="flex items-center justify-start gap-4 pt-9">
          <Image
            className={`h-24 aspect-square rounded-full  object-fill `}
            src={SplashScreenData[step - 1].image}
            alt="loginImage"
            width={96}
            height={96}
          />
          <div className="flex flex-col gap-3 ">
            <span className="text-3xl font-black text-vapormintWhite-100">
              Welcome to Mintflick
            </span>
            <span className="text-base font-medium text-vapormintBlack-100">
              Some interesting text that could give a feeling of trust to the
              user.
            </span>
          </div>
        </div>
        <Divider kind="center" size={1} />
        <div className="flex flex-col gap-3 ">
          <div className="flex items-center justify-between">
            <span
              onClick={() =>
                toastState.showToast([{ message: "hello", kind: "success" }])
              }
              className="text-2xl font-black text-vapormintWhite-100"
            >
              {walletAddress?.slice(0, 8) + "..." + walletAddress?.slice(-6)}
            </span>
            <CopyToClipboard
              className="text-lg font-bold cursor-pointer text-vapormintSuccess-500"
              text={walletAddress}
            ></CopyToClipboard>
          </div>
          <span className="text-base font-medium text-vapormintBlack-100">
            Some interesting text that could give a user a knowledge about
            crypto wallet.
          </span>
        </div>
        <Divider kind="center" size={1} />
        <TextInput
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          title={"username"}
          placeholder={"Pick a unique username"}
        />
        <TextInput
          // onChange={(e) => setEmail(e.target.value)}
          onChange={() => {}}
          value={email}
          title={"email"}
          placeholder={"example@gmail.com"}
        />
      </div>
      <Button
        handleClick={() => setShowOnboarding(true)}
        kind="success"
        type="outlined"
        size="base"
      >
        Next
      </Button>
      {showOnboarding && (
        <FullScreenOverlay
          onClose={() => {
            setShowOnboarding(false);
            setStep(1);
          }}
        >
          <div className="flex flex-col w-full h-full bg-vapormintBlack-300">
            {step === 4 ? (
              <div className="flex flex-col items-center justify-center flex-grow text-2xl font-bold text-vapormintWhite-100">
                creating your account...
              </div>
            ) : (
              <div className="flex flex-col items-center justify-start flex-grow">
                <div className="relative w-full mx-auto aspect-video ">
                  <Image
                    className={`w-full   h-full object-cover `}
                    src={SplashScreenData[step - 1].image}
                    alt="loginImage"
                    width={100}
                    height={100}
                  />
                  <span className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-vapormintBlack-300 "></span>
                </div>
                <div className="flex flex-col gap-4 px-8 py-6">
                  <span className="text-3xl font-bold text-vapormintWhite-100">
                    {SplashScreenData[step - 1].heading}
                  </span>
                  <span className="text-lg font-semibold text-vapormintWhite-100">
                    {SplashScreenData[step - 1].text}
                  </span>
                </div>
              </div>
            )}
            <Button
              handleClick={() => {
                if (step === 4) {
                  setStep(1);
                } else {
                  setStep(step + 1);
                }
              }}
              kind="success"
              type={step === 3 ? "solid" : "outlined"}
              size="base"
            >
              {step === 3 ? "Create account" : "Next"}
            </Button>
          </div>
        </FullScreenOverlay>
      )}
    </FullscreenContainer>
  );
}

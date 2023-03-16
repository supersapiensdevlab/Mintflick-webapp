import React from "react";
import { Loader } from "tabler-icons-react";

function Loading(props) {
  const slangText = [
    "NFTs are more than just a jpeg",
    "Never share your private keys",
    "Web3 is Web2 on steroids...",
    "Blockchain is the future",
    "NFTs are the future",
    "Buy the Dip",
    "WAGMI",
    "Decentralized doesn't mean Safe. Be cautious",
    "Create. Mint. Vibe",
    "Own your shit",
  ];
  return (
    <div className="h-full w-full flex flex-col justify-center items-center text-brand3">
      <Loader className="animate-spin" />

      {slangText[Math.floor(Math.random() * slangText?.length + 1)]}
    </div>
  );
}

export default Loading;

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Store";
import NftPostCard from "./NftPostCard";

function Nfts() {
  const State = useContext(UserContext);
  const [nfts, setnfts] = useState([]);

  useEffect(() => {
    let myNfts = [];
    State.database.nftData.map(
      (nft) =>
        nft.nft.owner === State.database.walletAddress && myNfts.push(nft)
    );
    console.log(myNfts);
    setnfts(myNfts);
  }, [State.database.nftData]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3  gap-2 w-full p-4 lg:p-0">
      {nfts.map((nft) => (
        <NftPostCard nftDetails={nft} />
      ))}
    </div>
  );
}

export default Nfts;

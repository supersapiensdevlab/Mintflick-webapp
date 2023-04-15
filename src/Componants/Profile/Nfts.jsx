import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Store";
import Loading from "../Loading/Loading";
import NftPostCard from "./NftPostCard";

function Nfts() {
  const State = useContext(UserContext);
  const [loader, setloader] = useState(true);

  const [nfts, setnfts] = useState([]);

  function loadNfts() {
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", `${process.env.REACT_APP_SHYFT_API_KEY}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.shyft.to/sol/v1/nft/read_all?network=${process.env.REACT_APP_SOLANA_NETWORK}&address=${State.database.userProfileData?.data.wallet_id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(State.database.userProfileData?.data.wallet_id, result);
        setnfts(result.result);
        setloader(false);
      })
      .catch((error) => console.log("error", error));
  }

  useEffect(() => {
    loadNfts();
  }, []);

  return (
    <div className="w-full max-w-2xl p-2 space-y-6">
      {!loader ? (
        <div className="grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 2xl:grid-cols-3 lg:p-0">
          {nfts?.length === 0 ? (
            <div className="mx-auto text-lg font-semibold w-fit text-brand4">
              No NFTs to show!
            </div>
          ) : (
            nfts?.map((nft) => <NftPostCard nftDetails={nft} />)
          )}
          <span className="text-lg font-bold text-brand1"> </span>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Nfts;

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
      `https://api.shyft.to/sol/v1/nft/read_all?network=devnet&address=${State.database.userProfileData?.data.wallet_id}`,
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
    <div className="w-full max-w-2xl  space-y-6 p-2">
      {!loader ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3  gap-4 w-full p-4 lg:p-0">
          {nfts.map((nft) => (
            <NftPostCard nftDetails={nft} />
          ))}
          <span className="text-lg font-bold text-brand1"> </span>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Nfts;

import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../Store";

export default function useLoadNfts() {
  const State = useContext(UserContext);
  const loadNfts = async () => {
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", `${process.env.REACT_APP_SHYFT_API_KEY}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(
      `https://api.shyft.to/sol/v1/marketplace/active_listings?network=${process.env.REACT_APP_SOLANA_NETWORK}&marketplace_address=${process.env.REACT_APP_SOLANA_MARKETPLACE_ADDRESS}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        let data = result.result;
        State.updateDatabase({
          nftData: data,
        });
      })
      .catch((error) => console.log("error", error));
  };

  return [loadNfts];
}

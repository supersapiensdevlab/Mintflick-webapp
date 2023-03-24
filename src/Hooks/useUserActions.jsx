import axios from "axios";
import React, { useState } from "react";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../Store";

export default function useUserActions() {
  const State = useContext(UserContext);
  const { userName } = useParams();
  async function loadFeed() {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}/feed`,
    })
      .then((response) => {
        let data = response.data;
        console.log(data);
        State.updateDatabase({
          feedData: data,
        });
        // loadNftsData();
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  async function loadUser() {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}/user/getLoggedInUser`,
      headers: {
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
    })
      .then((response) => {
        console.log(response);
        let temp = {
          data: {
            user: response.data,
          },
        };

        State.updateDatabase({
          userData: temp,
          walletAddress: temp.data.user.wallet_id,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function loadProfileCard() {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}/user/${userName}`,
    })
      .then((response) => {
        State.updateDatabase({ userProfileData: response });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function loadNftsData() {
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
        console.log("nftData", result.result);
      })
      .catch((error) => console.log("error", error));
  }

  return [loadFeed, loadUser, loadProfileCard, loadNftsData];
}

import axios from "axios";
import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../Store";

export default function useUserActions() {
  const State = useContext(UserContext);
  async function loadFeed() {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}/feed`,
    })
      .then((response) => {
        let data = response.data;
        State.updateDatabase({
          feedData: data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  async function loadUser() {
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`,

      data: {
        walletId: localStorage.getItem("walletAddress"),
      },
    })
      .then((response) => {
        console.log(response);

        State.updateDatabase({
          userData: response,
          walletAddress: response.data.user.wallet_id,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return [loadFeed,loadUser];
}

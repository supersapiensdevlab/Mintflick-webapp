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
  return [loadFeed];
}

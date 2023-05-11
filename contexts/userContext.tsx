"use client";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type StateProps = {
  userData: any;
  updateUserData: Function;
};
export const UserContext = createContext<StateProps>({
  userData: {},
  updateUserData: (data: any) => {},
});
export default function UserContextContainer({ children }: Props) {
  const [userData, setUserData] = useState({});
  const updateUserData = (data: any) => {
    setUserData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  async function isUserAvaliable(walletAddress: string) {
    console.log("Checking for User with Wallet:", walletAddress);
    await axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/getuser_by_wallet`,
      data: {
        walletId: walletAddress,
      },
    })
      .then((response) => {
        console.log("user data", response);
        updateUserData(response.data.user);
        console.log("user data saved in state");
        localStorage.setItem("authtoken", response.data.jwtToken);
        console.log("auth token saved in storage");
        localStorage.setItem("walletAddress", walletAddress);
        console.log("wallet address saved in storage");
      })
      .catch(async function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    const wallet = localStorage.getItem("walletAddress");
    console.log(wallet);
    wallet && isUserAvaliable(wallet);
  }, []);

  return (
    <div>
      <UserContext.Provider value={{ userData, updateUserData }}>
        {children}
      </UserContext.Provider>
    </div>
  );
}

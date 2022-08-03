import axios from "axios";
import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import BottomNavigation from "../Componants/Footer/BottomNavigation";
import Header from "../Componants/Header/Header";
import MobileHeader from "../Componants/Header/MobileHeader";
import { UserContext } from "../Store";

function HomeScreen() {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();

  async function isUserAvaliable(wallet) {
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_BASE_URL}/user/getuser_by_wallet`,
      data: {
        walletId: wallet,
      },
    })
      .then((response) => {
        console.log(response);
        State.updateDatabase({
          userData: response,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  useEffect(() => {
    isUserAvaliable(localStorage.getItem("walletAddress"));
  }, []);

  return (
    <div className="relative flex h-screen w-screen  ">
      <MobileHeader></MobileHeader>
      <Header className=""></Header>
      <div className=" w-full">
        <Outlet></Outlet>
      </div>
      <div className="lg:hidden w-full fixed z-50 bottom-0">
        <BottomNavigation></BottomNavigation>
      </div>
    </div>
  );
}

export default HomeScreen;

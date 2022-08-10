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

  useEffect(() => {
    // console.log(localStorage.getItem("walletAddress"));
    // console.log(JSON.parse(localStorage.getItem("provider")));
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

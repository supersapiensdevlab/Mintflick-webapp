import React from "react";
import { Outlet } from "react-router-dom";
import BottomNavigation from "../Componants/Footer/BottomNavigation";
import Header from "../Componants/Header/Header";
import MobileHeader from "../Componants/Header/MobileHeader";

function HomeScreen() {
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

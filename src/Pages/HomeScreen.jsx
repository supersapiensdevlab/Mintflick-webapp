import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Componants/Header/Header";

function HomeScreen() {
  return (
    <div className="relative flex h-screen w-screen bg-white dark:bg-slate-900 ">
      <Header className=""></Header>
      <div className=" w-full">
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default HomeScreen;

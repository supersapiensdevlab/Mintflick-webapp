import React from "react";
import loginBg from "../Assets/backgrounds/login_bg.jpg";

import { Outlet } from "react-router-dom";

function ConnectWallet() {
  return (
    <div className="z-50 flex justify-center bg-slate-100 dark:bg-slate-900 w-screen h-screen overflow-y-auto">
      <Outlet></Outlet>
      <div className="hidden lg:block w-1/2 h-full  ">
        <img src={loginBg} className="w-full h-full  object-cover" />
      </div>
    </div>
  );
}

export default ConnectWallet;

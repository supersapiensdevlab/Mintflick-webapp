import axios from "axios";
import React, { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BottomNavigation from "../Componants/Footer/BottomNavigation";
import Header from "../Componants/Header/Header";
import MobileHeader from "../Componants/Header/MobileHeader";
import { UserContext } from "../Store";
import { Helmet } from "react-helmet";
import ToastContainer from "../Componants/Toast/ToastContainer";
import ConnectWalletModal from "../Componants/Wallet/ConnectWalletModal";
import useUserActions from "../Hooks/useUserActions";

function HomeScreen() {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();
  const location = useLocation();
  const [loadFeed, loadUser, loadProfileCard, loadNftsData] = useUserActions();

  useEffect(() => {
    // console.log(localStorage.getItem("walletAddress"));
    // console.log(JSON.parse(localStorage.getItem("provider")));
    loadNftsData();
  }, []);

  return (
    <div className="relative flex flex-col h-screen w-screen  bg-white dark:bg-slate-900">
      <Helmet>
        <meta charSet="utf-8" />
        <title>MintFlick - Feed</title>
        <link rel="canonical" href="https://mintflick.app" />
      </Helmet>
      <MobileHeader></MobileHeader>
      {location.pathname == "/homescreen" ? (
        <></>
      ) : (
        <Header className=""></Header>
      )}
      <div className={` w-full`}>
        <Outlet></Outlet>
      </div>
      <div
        className={`${
          State.database.showBottomNav ? "" : "h-0"
        } transition-all ease-in-out lg:hidden w-full fixed z-40 bottom-0`}
      >
        {/* <button onClick={() => State.updateDatabase({ showBottomNav: false })}>
          show
        </button> */}
        <BottomNavigation></BottomNavigation>
      </div>
      {!State.database.provider && <ConnectWalletModal />}
    </div>
  );
}

export default HomeScreen;

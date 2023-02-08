import React, { useContext, useEffect, useState } from "react";
import {
  DeviceGamepad2,
  DoorExit,
  MessageDots,
  Moon,
  Settings,
  Sun,
  User,
} from "tabler-icons-react";
import { UserContext } from "../../Store";
import Main_logo from "../../Assets/logos/Main_logo";
import Main_logo_dark from "../../Assets/logos/Main_logo_dark";
import { NavLink, useNavigate } from "react-router-dom";
import coverImage from "../../Assets/backgrounds/cover.png";
import axios from "axios";
import ChatModal from "../ChatRoom/ChatModal";
import MintWalletModal from "../Profile/Modals/MintWalletModal";
import SolanaToken from "../../Assets/logos/SolanaToken";
import PolygonToken from "../../Assets/logos/PolygonToken";
import CopyToClipboard from "../CopyButton/CopyToClipboard";
import { Image } from "react-img-placeholder";
import placeholderImage from "../../Assets/profile-pic.png";
import SettingsModal from "../Profile/Modals/SettingsModal";

function MobileHeader() {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();

  const [chatModalOpen, setchatModalOpen] = useState(false);
  const [walletModalOpen, setwalletModalOpen] = useState(false);

  const [settingsModalOpen, setsettingsModalOpen] = useState(false);

  async function getUserData() {
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

  useEffect(() => {
    !State.database.userData.data && getUserData();
  }, []);

  return (
    <div
      className={`${
        State.database.showHeader ? "" : "-translate-y-16"
      } transition-all ease-in-out lg:hidden fixed z-50  top-0 flex px-4 lg:px-12 justify-between items-center h-16 bg-white dark:bg-slate-900 w-full shadow-mintflick`}
    >
      <div className="flex justify-between items-center space-x-4 h-full w-full">
        <div class="dropdown dropdown-start">
          <label tabindex="0" className=" avatar">
            <div className="w-10 rounded-full cursor-pointer">
              {/* <img
                src={
                  State.database.userData.data?.user.profile_image
                    ? State.database.userData.data.user.profile_image
                    : coverImage
                }
              /> */}
              <Image
                width={50}
                height={50}
                src={
                  State.database.userData.data?.user.profile_image
                    ? State.database.userData.data.user.profile_image
                    : coverImage
                }
                alt="profileImage"
                placeholderSrc={placeholderImage}
              />
            </div>
          </label>
          <ul
            tabindex="0"
            className="menu menu-compact dropdown-content mt-3 p-2 shadow-xl   bg-slate-100 dark:bg-slate-800 text-brand1 text-base font-medium rounded-lg w-52"
          >
            <li>
              <NavLink
                to={`/homescreen/profile/${
                  State.database.userData.data
                    ? State.database.userData.data.user.username
                    : ""
                }`}
                className="  hover:dark:bg-slate-900"
              >
                <User size={22}></User>Profile
              </NavLink>
            </li>
            <li onClick={() => setsettingsModalOpen(true)}>
              <a className=" hover:dark:bg-slate-900">
                <Settings size={22}></Settings>Settings
              </a>
            </li>
            {/* <label className="swap swap-rotate dark:text-gray-100">
              <input
                onChange={() =>
                  State.updateDatabase({
                    dark: !State.database.dark,
                  })
                }
                type="checkbox"
              />

              <MoonStars className="swap-on"></MoonStars>
              <Sun className="swap-off"></Sun>
            </label> */}
            <li>
              <a
                className=" hover:dark:bg-slate-900"
                onClick={() =>
                  State.updateDatabase({
                    dark: !State.database.dark,
                  })
                }
              >
                {State.database.dark ? (
                  <Moon size={22}></Moon>
                ) : (
                  <Sun size={22}></Sun>
                )}{" "}
                Mode
              </a>
            </li>
            <li>
              <span className="relative truncate hover:dark:bg-slate-900 text-emerald-600">
                {State.database.chainId === 0 ? (
                  <SolanaToken
                    onClick={() =>
                      State.database.chainId === 0
                        ? State.database.provider?.showWallet()
                        : ""
                    }
                    className={
                      State.database.chainId === 1 ? "saturate-0" : null
                    }
                  />
                ) : (
                  <PolygonToken
                    className={
                      State.database.chainId === 0 ? "saturate-0" : null
                    }
                  />
                )}{" "}
                <p className="absolute top-2 left-4 h-2 w-2 bg-green-700 rounded-full animate-ping"></p>
                {localStorage.getItem("walletAddress").slice(0, 6)}...
                {localStorage
                  .getItem("walletAddress")
                  .slice(
                    localStorage.getItem("walletAddress").length - 4,
                    localStorage.getItem("walletAddress").length
                  )}{" "}
                <CopyToClipboard text={localStorage.getItem("walletAddress")} />
              </span>
            </li>
            <li>
              <NavLink
                onClick={() => {
                  //logout();
                  localStorage.removeItem("authtoken");
                  localStorage.removeItem("walletAddress");
                  window.localStorage.clear();
                }}
                to={"/"}
                className="hover:bg-rose-500 "
              >
                <DoorExit size={22}></DoorExit> Logout
              </NavLink>
            </li>
          </ul>
        </div>
        <NavLink to={`/homescreen/home`}>
          {!State.database.dark ? (
            <Main_logo_dark></Main_logo_dark>
          ) : (
            <Main_logo></Main_logo>
          )}
        </NavLink>
        <div className="flex gap-1 justify-center items-center">
          {/* <button class="btn btn-circle btn-ghost ">
            <NavLink
              to={`/homescreen/chat/${
                State.database.userData.data
                  ? State.database.userData.data.user.username
                  : ""
              }`}
              state={{
                isDM: false,
                user2: {},
              }}
            >
              <DeviceGamepad2 size={28}></DeviceGamepad2>
            </NavLink>
          </button> */}
          <button class="btn btn-circle btn-ghost ">
            <NavLink
              to={`/homescreen/chat/${
                State.database.userData.data
                  ? State.database.userData.data.user.username
                  : ""
              }`}
              state={{
                isDM: false,
                user2: {},
              }}
            >
              <MessageDots size={28}></MessageDots>
            </NavLink>
          </button>
        </div>
        {/* <button
          class="btn btn-circle btn-ghost "
          onClick={() => setchatModalOpen(true)}
        >
          <MessageDots size={28}></MessageDots>
        </button> */}
      </div>
      {/* <ChatModal
        open={chatModalOpen}
        setOpen={setchatModalOpen}
        userName={State.database.userData.data?.user?.username}
        state={{
          isDM: false,
          user2: {},
        }}
      /> */}
      <MintWalletModal open={walletModalOpen} setOpen={setwalletModalOpen} />
      <SettingsModal open={settingsModalOpen} setOpen={setsettingsModalOpen} />
    </div>
  );
}

export default MobileHeader;

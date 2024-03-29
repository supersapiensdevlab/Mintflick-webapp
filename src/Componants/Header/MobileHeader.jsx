import React, { useContext, useEffect, useState } from "react";
import {
  Copy,
  DeviceGamepad2,
  DoorExit,
  MessageDots,
  Moon,
  Settings,
  Sun,
  User,
  Wallet,
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
      <div className="flex justify-between items-center  h-full w-full">
        <div className="dropdown dropdown-start ">
          <label tabIndex="0" className=" ">
            <div className="w-10 h-10 rounded-full cursor-pointer">
              {/* <img
                src={
                  State.database.userData.data?.user.profile_image
                    ? State.database.userData.data.user.profile_image
                    : coverImage
                }
              /> */}
              <Image
                className="rounded-full w-full h-full object-cover"
                width={50}
                height={50}
                src={
                  State.database.userData?.data?.user?.profile_image
                    ? State.database.userData?.data?.user?.profile_image
                    : coverImage
                }
                alt="profileImage"
                placeholderSrc={placeholderImage}
              />
            </div>
          </label>
          <ul
            tabIndex="0"
            className="menu menu-compact dropdown-content -ml-1 mt-5 p-2 shadow-xl border-2 border-slate-300  dark:border-slate-700  bg-slate-100 dark:bg-slate-900 text-brand1 text-base font-medium rounded-lg w-52"
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
              {" "}
              <div
                onClick={() =>
                  State.database.chainId === 0
                    ? State.database.provider?.showWallet()
                    : ""
                }
              >
                <Wallet size={22} /> My Wallet
              </div>
            </li>
            <li>
              <NavLink
                onClick={() => {
                  //logout();
                  State.database.walletProvider === "torus" &&
                    State.database.provider.logout();
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
            <li>
              <span className=" flex flex-col   gap-0 items-start truncate bg-slate-200 dark:bg-slate-900 p-0 mt-1">
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(State.database.walletAddress);
                    State.toast("success", "Wallet Address Copied!");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-center p-2  w-full capitalize text-white font-bold flex items-center justify-center gap-2"
                >
                  <span className="   text-center">
                    {localStorage.getItem("walletAddress")?.slice(0, 6)}...
                    {localStorage
                      .getItem("walletAddress")
                      ?.slice(
                        localStorage.getItem("walletAddress")?.length - 4,
                        localStorage.getItem("walletAddress")?.length
                      )}
                  </span>
                  <Copy size={18} />
                </div>
              </span>
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
          <button className="btn btn-circle btn-ghost ">
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

import React, { useContext, useEffect, useState } from "react";
import { DeviceGamepad2, MessageDots } from "tabler-icons-react";
import { UserContext } from "../../Store";
import Main_logo from "../../Assets/logos/Main_logo";
import Main_logo_dark from "../../Assets/logos/Main_logo_dark";
import { NavLink, useNavigate } from "react-router-dom";
import coverImage from "../../Assets/backgrounds/cover.png";
import axios from "axios";
import ChatModal from "../ChatRoom/ChatModal";
import MintWalletModal from "../Profile/Modals/MintWalletModal";

function MobileHeader() {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();

  const [chatModalOpen, setchatModalOpen] = useState(false);
  const [walletModalOpen, setwalletModalOpen] = useState(false);

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
        <div className="dropdown  mt-2">
          <label tabindex="0" className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img
                src={
                  State.database.userData.data?.user.profile_image
                    ? State.database.userData.data.user.profile_image
                    : coverImage
                }
              />
            </div>
          </label>
          <ul
            tabindex="0"
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-slate-100 dark:bg-slate-800 text-brand1 text-base font-medium rounded-lg w-52"
          >
            <li>
              <NavLink
                to={`/homescreen/profile/${
                  State.database.userData.data &&
                  State.database.userData.data.user.username
                }`}
                className="  hover:dark:bg-slate-900"
              >
                Profile
              </NavLink>
            </li>
            <li>
              <a className=" hover:dark:bg-slate-900">Settings</a>
            </li>
            <li>
              <span
                onClick={() => setwalletModalOpen(true)}
                className=" hover:dark:bg-slate-900"
              >
                Wallet
              </span>
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
                Dark mode {State.database.dark ? "off" : "on"}
              </a>
            </li>
            <li>
              <NavLink
                onClick={() => {
                  localStorage.clear();
                }}
                to={"/"}
                className="hover:bg-rose-500 "
              >
                Logout
              </NavLink>
            </li>
            <li>
              <a className="truncate hover:dark:bg-slate-900 text-emerald-600">
                {localStorage.getItem("walletAddress") && "Wallet connected"}
              </a>
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
    </div>
  );
}

export default MobileHeader;

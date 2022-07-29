import React, { useContext } from "react";
import {
  AccessPoint,
  Bell,
  MessageDots,
  MoonStars,
  Search,
  Sun,
} from "tabler-icons-react";
import { UserContext } from "../../Store";
import Main_logo from "../../Assets/logos/Main_logo";
import TopNavigation from "./TopNavigation";
import Main_logo_dark from "../../Assets/logos/Main_logo_dark";

function Header() {
  const State = useContext(UserContext);

  return (
    <div className="hidden lg:flex fixed z-50  top-0  px-4 lg:px-12 justify-between items-center h-20 bg-white dark:bg-slate-900 w-full shadow-mintflick	">
      <div className="flex items-center space-x-4 h-full w-1/3 -ml-2">
        {!State.database.dark ? (
          <Main_logo_dark></Main_logo_dark>
        ) : (
          <Main_logo></Main_logo>
        )}

        <div className="hidden lg:flex  items-center flex-grow">
          <input
            type="text"
            placeholder="Search for anything..."
            className="input input-bordered w-full max-w-xl "
          ></input>
          <Search className="-translate-x-8 dark:text-slate-100"></Search>
        </div>
      </div>
      <div className="hidden lg:flex w-1/3 items-center justify-center h-full  ">
        <TopNavigation></TopNavigation>
      </div>
      <div className="flex w-1/3 justify-end items-center space-x-4 h-full   ">
        <div className="hidden lg:flex  btn btn-outline btn-primary gap-2 rounded-full ">
          <AccessPoint size={28}></AccessPoint>
          GO LIVE
        </div>
        <button class="btn btn-circle btn-ghost">
          <Bell size={28}></Bell>
        </button>

        <button class="btn btn-circle btn-ghost ">
          <MessageDots size={28}></MessageDots>
        </button>

        <div class="dropdown dropdown-end">
          <label tabindex="0" className=" avatar">
            <div className="w-10 rounded-full">
              <img src="https://placeimg.com/80/80/people" />
            </div>
          </label>
          <ul
            tabindex="0"
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-slate-100 dark:bg-slate-800 text-brand1 text-base font-medium rounded-lg w-52"
          >
            <li>
              <a className="  hover:dark:bg-slate-900">Profile</a>
            </li>
            <li>
              <a className=" hover:dark:bg-slate-900">Settings</a>
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
              <a className="hover:bg-rose-500 ">Logout</a>
            </li>
            <li>
              <a className="truncate hover:dark:bg-slate-900 text-emerald-600">
                {State.database.walletAddress && "Wallet connected"}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;

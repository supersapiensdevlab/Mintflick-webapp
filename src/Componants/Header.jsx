import React, { useContext } from "react";
import {
  AccessPoint,
  Bell,
  MessageDots,
  MoonStars,
  Search,
  Sun,
} from "tabler-icons-react";
import { UserContext } from "../Store";
import Main_logo from "../Assets/logos/Main_logo";
import TopNavigation from "./TopNavigation";
import Main_logo_dark from "../Assets/logos/Main_logo_dark";

function Header() {
  const State = useContext(UserContext);

  return (
    <div className="absolute z-50  top-0 flex px-4 lg:px-12 justify-between items-center h-20 bg-white dark:bg-gray-900 w-full shadow-lg">
      <div className="flex items-center space-x-4 h-full w-1/3">
        {State.database.dark ? (
          <Main_logo_dark></Main_logo_dark>
        ) : (
          <Main_logo></Main_logo>
        )}

        <div className="hidden lg:flex  items-center flex-grow">
          <input
            type="text"
            placeholder="Search for anything..."
            className="input input-bordered w-full max-w-2xl "
          ></input>
          <Search className="-translate-x-8 dark:text-gray-100"></Search>
        </div>
      </div>
      <div className="hidden lg:flex items-center justify-center h-full  ">
        <TopNavigation></TopNavigation>
      </div>
      <div className="flex justify-end items-center space-x-4 h-full   ">
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
        <label className="swap swap-rotate dark:text-gray-100">
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
        </label>

        <div class="dropdown dropdown-end">
          <label tabindex="0" className=" avatar">
            <div className="w-10 rounded-full">
              <img src="https://placeimg.com/80/80/people" />
            </div>
          </label>
          <ul
            tabindex="0"
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-gray-100 dark:bg-slate-400 rounded-lg w-52"
          >
            <li>
              <a className="">Profile</a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;

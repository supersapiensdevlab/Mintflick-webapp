import React, { useContext } from "react";
import { MessageDots } from "tabler-icons-react";
import { UserContext } from "../../Store";
import Main_logo from "../../Assets/logos/Main_logo";
import Main_logo_dark from "../../Assets/logos/Main_logo_dark";

function MobileHeader() {
  const State = useContext(UserContext);

  return (
    <div className="lg:hidden fixed z-50  top-0 flex px-4 lg:px-12 justify-between items-center h-20 bg-white dark:bg-slate-900 w-full shadow-mintflick	">
      <div class="dropdown ">
        <label tabindex="0" className="avatar">
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
        </ul>
      </div>
      <div className="flex items-center h-full">
        {State.database.dark ? (
          <Main_logo_dark></Main_logo_dark>
        ) : (
          <Main_logo></Main_logo>
        )}
      </div>
      <div className="flex justify-end items-center space-x-4 h-full   ">
        <button class="btn btn-circle btn-ghost ">
          <MessageDots size={28}></MessageDots>
        </button>
      </div>
    </div>
  );
}

export default MobileHeader;

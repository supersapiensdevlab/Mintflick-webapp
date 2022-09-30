import React from "react";
import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../../Store";

function TextChannels() {
  const State = useContext(UserContext);
  return (
    <div className="flex flex-col items-start p-4 bg-slate-100 dark:bg-slate-800 w-full h-fit rounded-lg ">
      <p className="text-lg text-brand5 font-bold">Text Channels</p>
      <NavLink
        to={`/homescreen/chat/${
          State.database.userProfileData
            ? State.database.userProfileData.data.username
            : ""
        }`}
        state={{
          isDM: false,
          user2: State.database.userProfileData
            ? State.database.userProfileData.data
            : null,
        }}
      >
        <button className="text-base text-brand3 font-medium btn">#Chat</button>
      </NavLink>
      {State.database.userProfileData &&
        State.database.userData.data &&
        State.database.userProfileData.data.username !=
          State.database.userData.data.user.username && (
          <Link
            to={`/homescreen/chat/${
              State.database.userProfileData
                ? State.database.userProfileData.data.username
                : ""
            }`}
            state={{
              isDM: true,
              user2: State.database.userProfileData
                ? State.database.userProfileData.data
                : null,
            }}
          >
            <button className="text-base text-brand3 font-medium btn">
              #DM
            </button>
          </Link>
        )}
    </div>
  );
}

export default TextChannels;

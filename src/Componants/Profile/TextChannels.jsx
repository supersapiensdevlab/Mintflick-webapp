import React from "react";
import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../../Store";
import placeholderImage from "../../Assets/profile-pic.png";
import { Image } from "react-img-placeholder";

function TextChannels() {
  const State = useContext(UserContext);
  return (
    <div className="flex flex-col items-start p-4  bg-slate-100 dark:bg-slate-800 w-full h-fit rounded-lg ">
      <p className="text-lg text-brand5 font-bold">Join Channels</p>
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
        <button className=" text-brand2 font-medium btn btn-brand btn-sm">#Community</button>
      </NavLink>
      
    </div>
  );
}

export default TextChannels;

import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

function ProfileMedia() {
  const [active, setactive] = useState(1);
  return (
    <div className=" flex flex-col h-full w-full">
      <div className="flex space-x-2 w-fit bg-white dark:bg-slate-900 rounded-lg p-1">
        <NavLink
          to={"./posts"}
          className={({ isActive }) =>
            isActive
              ? `btn   btn-brand btn-sm rounded-lg`
              : `btn btn-sm btn-ghost dark:text-gray-100`
          }
        >
          Posts
        </NavLink>
        <NavLink
          to={"./videos"}
          className={({ isActive }) =>
            isActive
              ? `btn   btn-brand btn-sm rounded-lg`
              : `btn btn-sm btn-ghost dark:text-gray-100`
          }
        >
          Videos
        </NavLink>
        <NavLink
          to={"./music"}
          className={({ isActive }) =>
            isActive
              ? `btn   btn-brand btn-sm rounded-lg`
              : `btn btn-sm btn-ghost dark:text-gray-100`
          }
        >
          Music
        </NavLink>
        <NavLink
          to={"./playlists"}
          className={({ isActive }) =>
            isActive
              ? `btn   btn-brand btn-sm rounded-lg`
              : `btn btn-sm btn-ghost dark:text-gray-100`
          }
        >
          Playlist
        </NavLink>
        {/* <NavLink className="tab">Videos</NavLink>
        <NavLink className="tab">Music</NavLink>
        <NavLink className="tab">NFT's</NavLink> */}
      </div>
      <div className=" overflow-y-auto">
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default ProfileMedia;

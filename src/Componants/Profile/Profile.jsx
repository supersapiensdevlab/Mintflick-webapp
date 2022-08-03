import React from "react";
import Channels from "../Home/Channels";

function Profile() {
  return (
    <div className=" flex h-screen bg-slate-100 dark:bg-slate-800 lg:bg-white lg:dark:bg-slate-900">
      <div className="hidden lg:flex flex-col h-full w-1/4 ml-12 mr-4 pt-24 space-y-6 overflow-y-auto">
        <Channels></Channels>
      </div>
      <div className="w-full lg:w-3/4 flex flex-col items-center  h-full  pt-24  space-y-6 overflow-y-auto">
        profile
      </div>
    </div>
  );
}

export default Profile;

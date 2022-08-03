import React from "react";
import Channels from "../Home/Channels";
import ProfileCard from "./ProfileCard";
import TextChannels from "./TextChannels";

function Profile() {
  return (
    <div className=" flex flex-col lg:flex-row h-screen bg-slate-100 dark:bg-slate-800 lg:bg-white lg:dark:bg-slate-900">
      <div className="flex flex-col h-fit lg:h-full w-full lg:w-1/4 lg:ml-12 lg:mr-4 pt-16 lg:pt-24 space-y-6 overflow-y-auto">
        <ProfileCard></ProfileCard>
        <TextChannels></TextChannels>
        <TextChannels></TextChannels>
        <TextChannels></TextChannels>
        <TextChannels></TextChannels>
      </div>
      <div className="w-full lg:w-3/4 flex flex-col items-center  h-fit lg:h-full  pt-24 lg:mr-12   space-y-6 lg:overflow-y-auto ">
        <div className="h-full w-full mb-2 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
      </div>
    </div>
  );
}

export default Profile;

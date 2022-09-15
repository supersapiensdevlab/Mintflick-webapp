import React from "react";
import LiveChannels from "../Home/LiveChannels";
import LiveBanners from "./LiveBanners";
import LiveCategories from "./LiveCategories";
import LiveChannelCategories from "./LiveChannelCategories";

function Live() {

  return (
    <div className=" flex w-full h-screen  bg-white dark:bg-slate-900 ">
      <div className="hidden lg:flex flex-col h-full w-1/4 ml-12 pt-24  space-y-6 overflow-y-auto">
        <LiveChannels></LiveChannels>
      </div>
      <div className="w-full lg:w-3/4 lg:mr-12 h-full pt-24 space-y-6 overflow-y-auto">
        <LiveBanners></LiveBanners>
        <LiveCategories></LiveCategories>
        <LiveChannelCategories section_name="Live Now" event_status="Live"></LiveChannelCategories>
      </div>
    </div>
  );
}

export default Live;

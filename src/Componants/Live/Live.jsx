import React, { useContext, useEffect } from "react";
import { UserContext } from "../../Store";
import LiveChannels from "../Home/LiveChannels";
import LiveBanners from "./LiveBanners";
import LiveCategories from "./LiveCategories";
import LiveChannelCategories from "./LiveChannelCategories";
import ScheduledStream from "./ScheduledStream";

function Live() {
  const State = useContext(UserContext);
  useEffect(() => {
    State.updateDatabase({ showHeader: true });
    State.updateDatabase({ showBottomNav: true });
  }, []);
  return (
    <div className="flex w-full h-screen bg-white  dark:bg-slate-900">
      <div className="flex-col hidden w-1/4 h-full pt-24 ml-12 space-y-6 overflow-y-auto lg:flex">
        <LiveChannels></LiveChannels>
      </div>
      <div className="w-full h-full pt-16 pb-24 space-y-6 overflow-y-auto lg:w-3/4 lg:mr-12 lg:pt-24">
        <LiveBanners></LiveBanners>
        <LiveChannelCategories
          section_name="Live Now"
          event_status="Live"
        ></LiveChannelCategories>
        {/* <LiveCategories></LiveCategories> */}
        <ScheduledStream section_name="Scheduled Streams"></ScheduledStream>
      </div>
    </div>
  );
}

export default Live;

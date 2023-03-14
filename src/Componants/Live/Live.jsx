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
    <div className=" flex w-full h-screen  bg-white dark:bg-slate-900  ">
      <div className="hidden lg:flex flex-col h-full w-1/4 ml-12 pt-24  space-y-6 overflow-y-auto">
        <LiveChannels></LiveChannels>
      </div>
      <div className="w-full lg:w-3/4 lg:mr-12 h-full pt-16 lg:pt-24  space-y-6 overflow-y-auto pb-24">
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

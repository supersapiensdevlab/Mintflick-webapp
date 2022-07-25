import React from "react";
import LiveChannels from "../Home/LiveChannels";

function Live() {
  return (
    <div className=" flex w-full h-screen pt-24 bg-white dark:bg-slate-900 ">
      <div className="hidden lg:flex flex-col h-full w-1/4 ml-12 mr-4  space-y-6 overflow-y-auto">
        <LiveChannels></LiveChannels>
      </div>
      <div className="w-full lg:w-3/4 bg-red-700 flex flex-col items-center  h-full    space-y-6 overflow-y-auto">
        live
      </div>
    </div>
  );
}

export default Live;

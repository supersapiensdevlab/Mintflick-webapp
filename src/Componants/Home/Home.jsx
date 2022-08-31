import axios from "axios";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Store";
import AddPost from "./AddPost";
import Channels from "./Channels";
import GameOfLuck from "./GameOfLuck";
import LiveChannels from "./LiveChannels";
import ReportModal from "./Modals/ReportModal";
import ShareModal from "./Modals/ShareModal";
import TimeLine from "./TimeLine";

function Home() {
  return (
    <div className=" flex h-screen bg-slate-100 dark:bg-slate-800 lg:bg-white lg:dark:bg-slate-900">
      <div className="hidden lg:flex flex-col h-full w-1/4 ml-12 mr-4 pt-24 space-y-6 overflow-y-auto">
        <Channels></Channels>
        <LiveChannels></LiveChannels>
      </div>
      <div className="w-full lg:w-2/4 flex flex-col items-center  h-full  pt-24  space-y-6 overflow-y-auto">
        <AddPost></AddPost>
        <TimeLine className="z-10"></TimeLine>
      </div>
      <div className="hidden lg:flex flex-col items-end h-full w-1/4 pt-24 mr-12 ml-4">
        <GameOfLuck></GameOfLuck>
      </div>
      <ReportModal />
      <ShareModal />
    </div>
  );
}

export default Home;

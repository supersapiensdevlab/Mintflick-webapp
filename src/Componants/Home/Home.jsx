import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Store";
import AddPost from "./AddPost";
import Channels from "./Channels";
import GameOfLuck from "./GameOfLuck";
import LiveChannels from "./LiveChannels";
import BuyNFTModal from "./Modals/BuyNFTModal";
import ReportModal from "./Modals/ReportModal";
import ShareModal from "./Modals/ShareModal";
import TimeLine from "./TimeLine";
import { useRef } from "react";
import { ArrowUpCircle } from "tabler-icons-react";

function Home() {
  const buttonRef = useRef();
  const timelineRef = useRef();

  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    buttonRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  // useEffect(() => {
  //   if (timelineRef.current.scrollTop > 300) {
  //     setShowButton(true);
  //   } else {
  //     setShowButton(false);
  //   }
  // }, [timelineRef.current.scrollTop]);

  // console.log(timelineRef.current.scrollTop);

  return (
    <div className=" flex h-screen bg-slate-100 dark:bg-slate-800 lg:bg-white lg:dark:bg-slate-900">
      <div className="hidden lg:flex flex-col h-full w-1/4 ml-12 mr-4 pt-24 space-y-6 overflow-y-auto">
        <Channels></Channels>
        <LiveChannels></LiveChannels>
      </div>
      <div id="scrollableDiv" className="w-full lg:w-2/4 flex flex-col items-center  h-full  pt-24  space-y-6 overflow-y-auto">
        <div ref={buttonRef} className="-mt-6"></div>
        <AddPost></AddPost>
        {/* <div ref={timelineRef}> */}
        <TimeLine className="z-10"></TimeLine>
        {/* </div> */}
      </div>
      <div className="hidden lg:flex flex-col items-end h-full w-1/4 pt-24 mr-12 ml-4">
        <GameOfLuck></GameOfLuck>
      </div>
      <ShareModal />
      {true && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-12 dark:text-white animate-bounce"
        >
          <ArrowUpCircle size={36} />
        </button>
      )}
      <BuyNFTModal />
    </div>
  );
}

export default Home;

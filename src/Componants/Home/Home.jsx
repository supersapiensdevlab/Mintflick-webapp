import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../Store";
import AddPost from "./AddPost";
import Channels from "./Channels";
import GameOfLuck from "./GameOfLuck";
import LiveChannels from "./LiveChannels";
import ReportModal from "./Modals/ReportModal";
import ShareModal from "./Modals/ShareModal";
import TimeLine from "./TimeLine";
import { useRef } from "react";
import { ArrowUpCircle, ChevronUp } from "tabler-icons-react";
import FeedbackForm from "./FeedbackForm";
import producthuntImage from "../../Assets/productHunt.webp";
import WalletSummary from "../Wallet/WalletSummary";

function Home() {
  const State = useContext(UserContext);

  const buttonRef = useRef();
  const timelineRef = useRef();

  const [showButton, setShowButton] = useState(false);
  const [prevScrollPostion, setPrevScrollPosition] = useState(0);
  const [scrollTopCalled, setScrollTopCalled] = useState(false);

  useEffect(() => {
    State.updateDatabase({ showHeader: true });
    State.updateDatabase({ showBottomNav: true });
  }, []);

  const scrollToTop = () => {
    timelineRef.current.scrollIntoView({
      behavior: "smooth",
    });
    setPrevScrollPosition(0);
    setScrollTopCalled(true);
  };

  const handleScroll = () => {
    if (buttonRef.current) {
      const scrollPosition = buttonRef.current.scrollTop;
      if (prevScrollPostion <= scrollPosition) {
        setPrevScrollPosition(scrollPosition);
        setShowButton(false);
        State.updateDatabase({ showHeader: false });
      } else if (prevScrollPostion > scrollPosition) {
        setPrevScrollPosition(scrollPosition);
        if (scrollPosition > 80 && !scrollTopCalled) {
          setShowButton(true);
          State.updateDatabase({ showHeader: true });
        } else {
          setShowButton(false);
          setScrollTopCalled(false);
          State.updateDatabase({ showHeader: true });
        }
      }
    }
  };

  return (
    <div className="flex w-screen h-screen bg-slate-100 dark:bg-slate-800 lg:bg-white lg:dark:bg-slate-900">
      <div className="flex-col hidden w-1/4 h-full pt-24 ml-12 mr-4 space-y-6 overflow-y-auto lg:flex">
        {/* <Channels></Channels> */}
        <LiveChannels></LiveChannels>
      </div>
      <div
        id="scrollableDiv"
        className="flex flex-col items-center w-full h-full overflow-y-auto lg:w-2/4 pt-14 lg:pt-24 "
        ref={buttonRef}
        onScroll={handleScroll}
      >
        <div ref={timelineRef}></div>
        <a
          href="https://airtable.com/shrF2lZX7vSV844Oe"
          target={"_blank"}
          className="w-full max-w-2xl my-2 bg-white cursor-pointer lg:rounded-lg"
        >
          <img
            className="w-full lg:rounded-md"
            src={producthuntImage}
            alt="quest-banner"
          />
        </a>
        <AddPost></AddPost>

        <TimeLine></TimeLine>
      </div>
      <div className="flex-col items-end hidden w-1/4 h-full gap-2 pt-24 ml-4 mr-12 lg:flex">
        <GameOfLuck></GameOfLuck>
        <FeedbackForm></FeedbackForm>
        <WalletSummary />
      </div>
      {showButton && (
        <div className="fixed flex justify-center w-screen bottom-20 lg:bottom-5 ">
          <button
            onClick={scrollToTop}
            className="gap-1 capitalize btn btn-xs glass"
          >
            <ChevronUp size={16} />
            scroll to top
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;

import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BuildingCarousel,
  ChevronLeft,
  Dice,
  SteeringWheel,
} from "tabler-icons-react";
import SpinWheel from "./SpinWheel";
import MobileHeader from "../Header/MobileHeader";
import Header from "../Header/Header";
import { useLocation } from "react-router-dom";
import GameCard from "./GameCard";
import MintWallet from "../Profile/MintWallet";
import spinwheelimg from "../../Assets/Gaming Posters/spinwheel.jpg";
import spingameimg from "../../Assets/Gaming Posters/spingame.jpg";
import dicerollimg from "../../Assets/Gaming Posters/diceroll.jpg";
import { UserContext } from "../../Store";

const AllGames = () => {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();

  const location = useLocation();
  useEffect(() => {
    State.updateDatabase({ showHeader: false });
    State.updateDatabase({ showBottomNav: false });
  }, []);
  return (
    <div className="lg:px-12  w-screen h-screen  bg-white dark:bg-slate-900 flex flex-col items-center">
      {/* <div className='hidden lg:flex flex-col h-full w-1/4 ml-12 pt-24  space-y-6 overflow-y-auto'>
        <Filter></Filter>
        <EventCategories></EventCategories>
      </div> */}
      <div className="w-full p-4 flex items-center  max-w-3xl mx-auto">
        <button
          onClick={() => navigateTo("../home")}
          className="flex justify-center items-center text-brand3 font-semibold"
        >
          <ChevronLeft />
          Back
        </button>
        <span className="text-xl font-bold text-brand1 mx-auto -translate-x-8">
          Games
        </span>
        {/* <span
          onClick={() => setwalletModalOpen(true)}
          className="  text-brand1 "
        >
          <Wallet />
        </span> */}
      </div>
      <div className="py-2 px-4 w-full max-w-3xl mx-auto flex gap-2 sm:rounded-xl bg-slate-100 dark:bg-slate-800">
        <input
          type="text"
          placeholder="Search Games"
          className="input input-bordered w-full  flex-grow"
        />
      </div>
      <div className="flex-grow w-full py-4 overflow-y-auto">
        <div className="w-full px-2 sm:w-fit h-fit  grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 sm:gap-y-8 sm:mx-auto">
          <div className=" ">
            <GameCard
              image={spinwheelimg}
              link={`/homescreen/game/spinwheel`}
              name={"Spinwheel"}
            />
          </div>
          <div className=" ">
            <GameCard
              image={dicerollimg}
              link={`/homescreen/game/rolldice`}
              name={"Dice"}
            />
          </div>
          <div className=" ">
            <GameCard
              image={spingameimg}
              link={`/homescreen/game/spingame`}
              name={"Jackpot"}
            />
          </div>
        </div>{" "}
      </div>

      {/* <div className="hidden lg:flex flex-col h-fit lg:h-full    lg:w-1/4 lg:ml-4 lg:mr-12 pt-4 lg:space-y-6 lg:overflow-y-auto">
        <MintWallet />
      </div> */}
    </div>
  );
};

export default AllGames;

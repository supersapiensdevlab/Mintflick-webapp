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
    <div className="flex flex-col items-center w-screen h-screen bg-white lg:px-12 lg:pt-24 dark:bg-slate-900">
      {/* <div className='flex-col hidden w-1/4 h-full pt-24 ml-12 space-y-6 overflow-y-auto lg:flex'>
        <Filter></Filter>
        <EventCategories></EventCategories>
      </div> */}
      <div className="flex items-center w-full max-w-3xl gap-2 p-4 mx-auto">
        <button
          onClick={() => navigateTo("../home")}
          className="flex items-center justify-center font-semibold text-brand3"
        >
          <ChevronLeft />
          Back
        </button>
        {/* <span className="mx-auto text-xl font-bold -translate-x-8 text-brand1">
          Games
        </span>{" "} */}
        <input
          type="text"
          placeholder="Search Games"
          className="flex-grow input input-sm input-bordered"
        />
        {/* <span
          onClick={() => setwalletModalOpen(true)}
          className=" text-brand1"
        >
          <Wallet />
        </span> */}
      </div>
      {/* <div className="flex w-full max-w-3xl gap-2 px-4 py-2 mx-auto sm:rounded-xl bg-slate-100 dark:bg-slate-800">
        <input
          type="text"
          placeholder="Search Games"
          className="flex-grow w-full input input-bordered"
        />
      </div> */}
      <div className="flex-grow w-full py-4 overflow-y-auto">
        <div className="grid w-full grid-cols-1 px-2 sm:w-fit h-fit md:grid-cols-2 gap-x-4 gap-y-4 sm:gap-y-8 sm:mx-auto">
          <div className="">
            <GameCard
              image={spinwheelimg}
              link={`/homescreen/game/spinwheel`}
              name={"Spinwheel"}
            />
          </div>
          <div className="">
            <GameCard
              image={dicerollimg}
              link={`/homescreen/game/rolldice`}
              name={"Dice"}
            />
          </div>
          <div className="">
            <GameCard
              image={spingameimg}
              link={`/homescreen/game/spingame`}
              name={"Jackpot"}
            />
          </div>
        </div>{" "}
      </div>

      {/* <div className="flex-col hidden pt-4 lg:flex h-fit lg:h-full lg:w-1/4 lg:ml-4 lg:mr-12 lg:space-y-6 lg:overflow-y-auto">
        <MintWallet />
      </div> */}
    </div>
  );
};

export default AllGames;

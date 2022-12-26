import React from "react";
import { Link } from "react-router-dom";
import { BuildingCarousel, Dice, SteeringWheel } from "tabler-icons-react";
import SpinWheel from "./SpinWheel";
import MobileHeader from "../Header/MobileHeader";
import Header from "../Header/Header";
import { useLocation } from "react-router-dom";
import GameCard from "./GameCard";
import MintWallet from "../Profile/MintWallet";
import spinwheelimg from "../../Assets/Gaming Posters/spinwheel.jpg";
import spingameimg from "../../Assets/Gaming Posters/spingame.jpg";
import dicerollimg from "../../Assets/Gaming Posters/diceroll.jpg";

const AllGames = () => {
  const location = useLocation();
  return (
    <>
      <div className=" pt-20 flex  h-screen w-screen bg-white dark:bg-slate-900">
        <div className="hidden lg:flex flex-col h-full w-1/4 ml-12 pt-24  space-y-6 overflow-y-auto"></div>
        <div className="p-4 h-full w-full lg:w-2/4 flex flex-col justify-start items-center space-x-5 overflow-auto">
          <div class="grid grid-cols-3  gap-4 w-full   ">
            {/* <div className="col-span-3 h-48 bg-white rounded-lg"></div> */}
            <div className="row-span-2">
              <GameCard
                image={spinwheelimg}
                link={`/homescreen/game/spinwheel`}
              />
            </div>
            <div className="col-span-2">
              <GameCard
                image={dicerollimg}
                link={`/homescreen/game/rolldice`}
              />
            </div>
            <div className="col-span-2">
              <GameCard
                image={spingameimg}
                link={`/homescreen/game/spingame`}
              />
            </div>{" "}
            <div className="col-span-2">
              <GameCard
                image={dicerollimg}
                link={`/homescreen/game/rolldice`}
              />
            </div>{" "}
            <div className="row-span-2">
              <GameCard
                image={spinwheelimg}
                link={`/homescreen/game/spinwheel`}
              />
            </div>
            <div className="col-span-2">
              <GameCard
                image={spingameimg}
                link={`/homescreen/game/spingame`}
              />
            </div>{" "}
          </div>
        </div>{" "}
        <div className="hidden lg:flex flex-col h-fit lg:h-full    lg:w-1/4 lg:ml-4 lg:mr-12 pt-4 lg:space-y-6 lg:overflow-y-auto">
          <MintWallet />
        </div>
      </div>
    </>
  );
};

export default AllGames;

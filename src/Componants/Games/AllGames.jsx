import React from "react";
import { Link } from "react-router-dom";
import { BuildingCarousel, Dice, SteeringWheel } from "tabler-icons-react";
import SpinWheel from "./SpinWheel";
import MobileHeader from "../Header/MobileHeader";
import Header from "../Header/Header";
import { useLocation } from "react-router-dom";

const AllGames = () => {
  const location = useLocation();
  return (
    <>
      <div className="p-2 pt-20  h-screen bg-slate-100 dark:bg-slate-800">
        <div className="h-full w-full flex justify-center items-center space-x-5">
          <Link to={`/homescreen/game/spinwheel`}>
            <button className="btn btn-brand btn-md flex space-x-2 text-white w-40">
              <SteeringWheel size={20} /> <p>Spin Wheel</p>
            </button>
          </Link>
          <Link to={`/homescreen/game/rolldice`}>
            <button className="btn btn-brand btn-md flex space-x-2 text-white w-40">
              <Dice size={20} /> <p>Roll Dice</p>
            </button>
          </Link>
          <Link to={`/homescreen/game/spingame`}>
            <button className="btn btn-brand btn-md flex space-x-2 text-white w-40">
              <BuildingCarousel size={20} /> <p>Spin Game</p>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AllGames;

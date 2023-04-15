import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../../Store";

function GameOfLuck() {
  const State = useContext(UserContext);

  return (
    <div className="flex flex-col items-center w-full p-5 space-y-2 h-fit bg-slate-100 dark:bg-slate-800 rounded-xl">
      <p className="flex items-center w-full text-lg font-black text-brand3">
        🎮 &nbsp;Play Now
      </p>
      <p className="w-full text-sm font-medium text-brand3">
        Welcome to the Spin Game, here you can play the game of chance and win
        big. You can play the game by clicking on the button below.
      </p>

      <Link
        to={`/homescreen/allgames`}
        className="w-full capitalize btn btn-brand"
      >
        Lets Go!
      </Link>
    </div>
  );
}

export default GameOfLuck;

import React from "react";
import { NavLink } from "react-router-dom";

function GameOfLuck() {
  return (
    <div className="flex flex-col items-center  w-full h-fit bg-slate-100 dark:bg-slate-800 rounded-xl p-5 space-y-2">
      <p className="w-full font-black text-lg text-brand5 flex items-center">
        Live Now<div className="badge bg-brand border-none badge-sm mx-2"></div>
      </p>
      <p className="w-full font-medium text-sm text-brand3">
        Welcome to the Spin Game, here you can play the game of chance and win
        big. You can play the game by clicking on the button below.
        <NavLink to={"../post/1234"}>Go to Post details</NavLink>
      </p>

      <button className="btn  btn-brand" onClick={() => {}}>
        Lets Go!
      </button>
    </div>
  );
}

export default GameOfLuck;

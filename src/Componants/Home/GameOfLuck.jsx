import React from "react";

function GameOfLuck() {
  return (
    <div className="flex flex-col items-center  w-full h-fit bg-gray-100 dark:bg-slate-800 rounded-xl p-5 space-y-2">
      <p className="w-full font-black text-lg text-gray-400 flex items-center">
        LIVE NOW<div className="badge bg-brand border-none badge-sm mx-2"></div>
      </p>
      <p className="w-full font-medium dark:text-white">
        Welcome to the Spin Game, here you can play the game of chance and win
        big. You can play the game by clicking on the button below.
      </p>

      <button className="btn  btn-primary" onClick={() => {}}>
        Lets Go!
      </button>
    </div>
  );
}

export default GameOfLuck;

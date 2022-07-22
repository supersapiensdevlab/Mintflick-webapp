import React, { useContext } from "react";
import { UserContext } from "../Store";

function GameOfLuck() {
  const State = useContext(UserContext);

  return (
    <div className='flex flex-col items-center  w-full h-fit bg-brand/5 rounded-xl p-5 space-y-2'>
      <p className='w-full font-black text-lg text-brand '>LIVE NOW</p>
      <p className='w-full font-medium text-sm'>
        Welcome to the Spin Game, here you can play the game of chance and win
        big. You can play the game by clicking on the button below.
      </p>
      {JSON.stringify(State.database)}
      <button
        className='btn btn-primary'
        onClick={() => {
          State.updateDatabase({ age: 23 });
        }}>
        Lets Go!
      </button>
    </div>
  );
}

export default GameOfLuck;

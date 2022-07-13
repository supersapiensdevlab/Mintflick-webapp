import React from "react";
import Button from "../UiComponants/Button";

function GameOfLuck() {
  return (
    <div className='flex flex-col items-center  w-72 h-fit bg-brand/5 rounded-xl p-5 space-y-2'>
      <p className='w-full font-black text-lg text-brand '>LIVE NOW</p>
      <p className='w-full font-medium text-sm'>
        Welcome to the Spin Game, here you can play the game of chance and win
        big. You can play the game by clicking on the button below.
      </p>
      <Button text='Lets Go!'></Button>
    </div>
  );
}

export default GameOfLuck;

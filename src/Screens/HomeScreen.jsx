import React from "react";
import AddPost from "../Componants/AddPost";
import Channels from "../Componants/Channels";
import GameOfLuck from "../Componants/GameOfLuck";
import Header from "../Componants/Header";
import LiveChannels from "../Componants/LiveChannels";
import TimeLine from "../Componants/TimeLine";

function HomeScreen() {
  return (
    <div className='relative flex h-screen bg-gray-900 '>
      <Header className=''></Header>
      <div className='hidden lg:flex flex-col h-full w-1/4 ml-20 pt-36 space-y-6 overflow-y-auto'>
        <Channels></Channels>
        <LiveChannels></LiveChannels>
      </div>
      <div className='w-full lg:w-2/3 flex flex-col items-center  h-full pt-24  lg:pt-36 space-y-6 overflow-y-auto'>
        <AddPost></AddPost>
        <TimeLine className='z-10'></TimeLine>
      </div>
      <div className='hidden lg:flex flex-col items-end h-full w-1/4 pt-36 mr-20'>
        <GameOfLuck></GameOfLuck>
      </div>
    </div>
  );
}

export default HomeScreen;

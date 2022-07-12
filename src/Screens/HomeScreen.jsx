import React from "react";
import Channels from "../Componants/Channels";
import Header from "../Componants/Header";

function HomeScreen() {
  return (
    <div className='relative flex h-screen bg-gray-800 '>
      <Header></Header>

      <div className=' h-full w-1/4 ml-20 pt-36 overflow-y-auto'>
        <Channels></Channels>
      </div>
      <div className='bg-red-400 h-full w-2/4'></div>
      <div className='bg-lime-500 h-full w-1/4 mr-20'></div>
    </div>
  );
}

export default HomeScreen;

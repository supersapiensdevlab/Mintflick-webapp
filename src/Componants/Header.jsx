import React from "react";
import Main_logo from "./Main_logo";
import TopNavigation from "./TopNavigation";

function Header() {
  return (
    <div className='absolute z-50  top-0 flex px-20 justify-between h-20 bg-gray-900/70 backdrop-blur-lg w-full rounded-b-xl shadow-lg'>
      <div className='flex items-center h-full w-1/3'>
        <Main_logo></Main_logo>
        <div className='hidden lg:flex  items-center flex-grow  mx-8 focus:ring-2'>
          <input
            type='text'
            placeholder='Search for anything...'
            className='input w-full max-w-lg rounded-full bg-gray-600 px-4 '></input>

          <i className='fa fa-search -translate-x-8' aria-hidden='true'></i>
        </div>
      </div>
      <div className='hidden lg:flex items-center justify-center h-full w-1/3 '>
        <TopNavigation></TopNavigation>
      </div>
      <div className='flex justify-end space-x-20 h-full w-1/3 py-4 '>
        <div className='flex items-center border-2 border-brand rounded-full text-brand  font-bold text-sm px-6 cursor-pointer'>
          GO LIVE
        </div>
        <div className='flex items-center text-brand  h-full cursor-pointer'>
          <i class='fa-solid fa-bell fa-2x'></i>
        </div>
        <div className='h-full avatar'>
          <div className=' rounded-full'>
            <img src='https://placeimg.com/192/192/people' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;

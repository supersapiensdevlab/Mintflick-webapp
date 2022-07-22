import React from "react";
import Main_logo from "./Main_logo";
import TopNavigation from "./TopNavigation";

function Header() {
  return (
    <div className='absolute z-50  top-0 flex px-4 lg:px-12 justify-between h-20 bg-gray-900/70 backdrop-blur-lg w-full rounded-b-xl shadow-lg'>
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
      <div className='flex justify-end space-x-8 h-full w-1/3 py-4 '>
        <div className='hidden lg:flex  btn btn-outline rounded-full hover:bg-alt hover:text-white text-brand'>
          GO LIVE
        </div>
        <div className='hidden lg:flex items-center text-brand  h-full cursor-pointer'>
          <i className='fa-solid fa-bell fa-2x'></i>
        </div>
        <div className='flex items-center text-brand  h-full cursor-pointer'>
          <i className='fa fa-message fa-2x'></i>
        </div>

        <div className='h-full avatar'>
          <div className='h-12 w-12 rounded-full'>
            <img src='https://placeimg.com/192/192/people' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;

import React from "react";
import OutlineButton from "../UiComponants/OutlineButton";

function AddPost() {
  return (
    <div className='hidden lg:block w-full max-w-2xl h-fit bg-brand/5  rounded-xl py-5 px-28 space-y-8'>
      <div className='flex space-x-4'>
        <img
          className='h-12 rounded-full'
          src='https://placeimg.com/192/192/people'
          alt='Tailwind-CSS-Avatar-component'
        />
        <textarea
          className='flex-grow textarea h-12 rounded-3xl '
          placeholder="What's on your mind?"></textarea>
      </div>
      <div className='flex justify-between'>
        <OutlineButton
          text='Photo'
          leftIcon={
            <i className='fa-solid fa-camera fa-xl text-brand'></i>
          }></OutlineButton>
        <OutlineButton
          text='Video'
          leftIcon={
            <i className='fa-solid fa-video fa-xl text-brand'></i>
          }></OutlineButton>
        <OutlineButton
          text='Music'
          leftIcon={
            <i className='fa-solid fa-music fa-xl text-brand'></i>
          }></OutlineButton>
      </div>
    </div>
  );
}

export default AddPost;

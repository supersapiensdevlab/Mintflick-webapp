import React from "react";

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
        <button className='btn btn-outline gap-2 hover:bg-alt hover:text-white text-brand'>
          <i className='fa-solid fa-camera fa-xl '></i>
          Photo
        </button>
        <button className='btn btn-outline gap-2 hover:bg-alt hover:text-white text-brand'>
          <i className='fa-solid fa-video fa-xl '></i>
          Video
        </button>
        <button className='btn btn-outline gap-2 hover:bg-alt hover:text-white text-brand'>
          <i className='fa-solid fa-music fa-xl '></i>
          Music
        </button>
      </div>
    </div>
  );
}

export default AddPost;

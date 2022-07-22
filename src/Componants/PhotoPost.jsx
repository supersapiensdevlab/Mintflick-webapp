import React from "react";

function PhotoPost(props) {
  return (
    <div className='w-full h-fit bg-brand/5 rounded-xl p-4 lg:p-12 space-y-4'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          <img
            className='h-12 w-12 rounded-full object-cover'
            src={props.profilePic}
            alt='Tailwind-CSS-Avatar-component'
          />
          <div>
            <p className='font-semibold text-base text-white'>
              {props.profileName}
            </p>
            <p className='font-normal text-xs text-white/50'>
              {props.timestamp}
            </p>
          </div>
        </div>
        <i className='fa-solid fa-ellipsis-vertical fa-xl'></i>
      </div>
      <p className='font-normal text-base text-white w-full'>{props.text}</p>
      <div className='relative w-full h-fit z-10'>
        <img className='w-full rounded-lg' src={props.image} alt='User Post' />
        <div className='absolute right-4 bottom-4 flex h-fit w-fit items-center p-4 rounded-full bg-black/60 backdrop-blur-sm'>
          <img
            src='https://www.cryptologos.cc/logos/polygon-matic-logo.png?v=022'
            className=' h-4 w-4  '></img>
          <p className='text-white text-sm  ml-1'>{props.price}</p>
        </div>
      </div>
      <div className='flex justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='cursor-pointer flex items-center space-x-2'>
            <i class='fa-solid fa-heart fa-xl text-rose-700'></i>
            <p className='font-medium text-sm text-rose-700'>
              {props.likeCount}
            </p>
          </div>
          <div className='cursor-pointer flex items-center space-x-2'>
            <i class='fa-solid fa-comment fa-xl text-white/50'></i>
            <p className='font-medium text-sm text-white'>
              {props.commentCount}
            </p>
          </div>
          <div className='cursor-pointer flex items-center space-x-2'>
            <i className='fa-solid fa-share-nodes fa-xl text-white/50'></i>
          </div>
        </div>
        <div className='cursor-pointer flex items-center border-2 border-brand px-4 py-2 rounded-lg space-x-2'>
          <p className='font-bold text-sm text-brand'>Owner</p>
          <p className=' font-semibold text-sm text-white'>{`@${props.ownerId}`}</p>
        </div>
      </div>
    </div>
  );
}

export default PhotoPost;

'use client';
import Avatar from '@/components/molecules/Avatar';
import Divider from '@/components/molecules/Divider';
import FullscreenContainer from '@/components/molecules/FullscreenContainer';
import Header from '@/components/molecules/Header';
import { UserContext } from '@/contexts/userContext';
import Image from 'next/image';
import React, { useContext } from 'react';

type Props = {};

export default function page({}: Props) {
  const userState = useContext(UserContext);

  return (
    <FullscreenContainer className='select-none  border-x-[1px] border-vapormintBlack-200/60 relative flex flex-col items-start max-w-lg pt-14 mx-auto overflow-hidden bg-vapormintBlack-300'>
      <Header text='Back' />

      <div className='w-full h-full overflow-y-scroll scrollbar-none'>
        <div className='flex flex-col items-start w-full'>
          {userState.userData.cover_image ? (
            <Image
              className={`w-full object-cover aspect-video `}
              src={userState.userData.cover_image}
              alt='coverImage'
              width={100}
              height={100}
            />
          ) : (
            <div
              className={`  bg-vapormintBlack-200 animate-pulse w-full  aspect-video  `}
            />
          )}
          <div className='flex items-center w-full gap-2 px-4 py-3 cursor-pointer text-vapormintWarning-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-4 h-4'>
              <path d='M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z' />
            </svg>
            <h1 className='text-base font-semibold '>Update Thumbnail</h1>
          </div>
          <div className='w-full px-4 py-3'>
            <h1 className='w-full text-2xl font-bold text-vapormintWhite-100'>
              Livestream title{' '}
            </h1>
          </div>
        </div>{' '}
        <Divider kind='center' size={1} />
        <div className='flex gap-[2px] items-center px-4 py-3'>
          <Avatar kind='default' size='xs' />
          <span className='text-sm font-semibold text-vapormintWhite-300'>
            Arlene McCoy
          </span>
          <span className='ml-4 text-sm font-medium cursor-pointer text-vapormintSuccess-500'>
            Follow
          </span>
        </div>
        <div className='flex items-center w-full gap-2 px-4 py-3'>
          <span className='text-xs font-medium text-vapormintSuccess-500'>
            12,343
          </span>{' '}
          <span className='text-sm font-semibold text-vapormintBlack-200'>
            Views{' '}
          </span>
        </div>
        <Divider kind='solid' size={1} />
        <div className='flex flex-col gap-2 px-4 py-2 text-vapormintWhite-100'>
          <span className='text-lg font-semibold '>Description</span>
          <span className='text-base font-light '>
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint. Velit officia consequat duis enim velit mollit. Exercitation
            veniam consequat sunt nostrud amet.{' '}
          </span>
        </div>{' '}
        <Divider kind='solid' size={1} />{' '}
        <div className='flex flex-col gap-2 px-4 py-2 text-vapormintWhite-100'>
          <span className='text-lg font-semibold '>Details</span>
          <div className='flex items-center justify-start w-full gap-2 px-4 '>
            <h1 className='text-base font-medium text-vapormintWhite-300 '>
              Location
            </h1>{' '}
            <h1 className='text-base font-bold text-vapormintSuccess-400 '>
              Google maps link
            </h1>
          </div>{' '}
          <div className='flex items-center justify-start w-full gap-2 px-4 '>
            <h1 className='text-base font-medium text-vapormintWhite-300 '>
              Link
            </h1>{' '}
            <h1 className='text-base font-bold text-vapormintSuccess-400 '>
              link.com
            </h1>
          </div>{' '}
        </div>{' '}
      </div>
    </FullscreenContainer>
  );
}

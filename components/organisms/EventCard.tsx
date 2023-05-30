import React from 'react';
import Avatar from '../molecules/Avatar';
import Tick from '../molecules/Tick';
import Image from 'next/image';
import social from '@/public/social.webp';
import { useRouter } from 'next/navigation';

type Props = {};

export default function EventCard({}: Props) {
  const router = useRouter();

  return (
    <div className='w-full p-4 space-y-2 select-none snap-start'>
      <div className='flex items-end w-full gap-2'>
        <Image
          className={`w-full    h-full object-cover rounded-lg border-[0.5px] border-vapormintBlack-200`}
          src={social}
          alt='loginImage'
          width={100}
          height={100}
        />
        <div className='flex flex-col items-center justify-end gap-3 w-fit'>
          <div className='flex flex-col items-center gap-[2px]'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='w-6 h-6 text-vapormintBlack-100'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z'
              />
            </svg>

            <span className='text-xs font-semibold text-vapormintWhite-300'>
              999K
            </span>
          </div>

          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-6 h-6 text-vapormintBlack-100'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z'
            />
          </svg>

          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-6 h-6 text-vapormintBlack-100'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z'
            />
          </svg>
        </div>
      </div>
      <div className='flex items-center gap-1'>
        <Avatar kind='luxury' size='md' />
        <div className='flex flex-col gap-[1px]'>
          <div className='flex items-center gap-1'>
            <span className='text-sm font-semibold cursor-pointer text-vapormintWhite-100'>
              username
            </span>
            <Tick />
            <span className='text-sm font-medium cursor-pointer text-vapormintMint-300'>
              Follow
            </span>
          </div>
          <span className='text-sm font-semibold text-vapormintLuxury-300'>
            Live Now
          </span>
        </div>
      </div>
      <div className='flex flex-col flex-grow gap-1'>
        <div className='flex items-center gap-1'>
          <div className='  py-1 px-2 text-xs font-semibold rounded-full border-[1px] border-vapormintBlack-200 text-vapormintSuccess-500  '>
            free
          </div>
          <div className='py-1 px-2 text-xs font-semibold rounded-full border-[1px] border-vapormintBlack-200 text-vapormintWhite-100'>
            Online
          </div>
          <div className='py-1 px-2 text-xs font-semibold rounded-full border-[1px] border-vapormintBlack-200 text-vapormintWhite-100'>
            Meetup
          </div>
        </div>
        <span className='text-lg font-bold text-vapormintWhite-200'>
          Amet minim mollit non deserunt
        </span>
        <p className='text-base font-medium text-vapormintBlack-100'>
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis enim velit mollit. Exercitation
          veniam consequat sunt nostrud amet...
          <span
            onClick={() => router.push(`/events/1234`)}
            className='inline text-xs cursor-pointer text-vapormintSuccess-500'
          >
            View details
          </span>
        </p>
      </div>
    </div>
  );
}

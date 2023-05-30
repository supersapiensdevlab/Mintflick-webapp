'use client';
import React, { useContext, useState } from 'react';
import GradientDivider from '../molecules/GradientDivider';
import { usePathname, useRouter } from 'next/navigation';
import Main_logo from '../molecules/MainLogo';
import Divider from '../molecules/Divider';
import Avatar from '../molecules/Avatar';
import { UserContext } from '@/contexts/userContext';

type Props = {};

export default function Sidebar({}: Props) {
  const [active, setActive] = useState('home');
  const router = useRouter();
  const path = usePathname();
  const userState = useContext(UserContext);

  return path === '/home' ||
    path === '/live' ||
    path === '/events' ||
    path === '/explore' ||
    path === '/notifications' ? (
    <div className='flex-col hidden h-screen lg:flex border-l-[1px] border-vapormintBlack-200/60'>
      <div className='flex items-center gap-2 px-4 py-2 text-2xl font-bold'>
        <Main_logo />
        Mintflick
      </div>
      <Divider kind='solid' size={1} />
      <div className='flex flex-col p-4'>
        <div
          onClick={() => {
            setActive('home');
            router.push('home');
          }}
          className={`${
            active === 'home'
              ? 'bg-vapormintWhite-100 text-vapormintBlack-300'
              : 'text-vapormintWhite-100 hover:bg-vapormintBlack-200'
          } flex items-center justify-start w-48 gap-3 text-base font-semibold cursor-pointer py-3 px-4 rounded-full`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-6 h-6 '
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
            />
          </svg>{' '}
          {'Home'}
        </div>
        <div
          onClick={() => {
            setActive('live');
            router.push('live');
          }}
          className={`${
            active === 'live'
              ? 'bg-vapormintWhite-100 text-vapormintBlack-300'
              : 'text-vapormintWhite-100 hover:bg-vapormintBlack-200'
          } flex items-center justify-start w-48 gap-3 text-base font-semibold cursor-pointer py-3 px-4 rounded-full`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-6 h-6 '
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
            />
          </svg>
          {'Live'}
        </div>
        <div
          onClick={() => {
            setActive('events');
            router.push('events');
          }}
          className={`${
            active === 'events'
              ? 'bg-vapormintWhite-100 text-vapormintBlack-300'
              : 'text-vapormintWhite-100 hover:bg-vapormintBlack-200'
          } flex items-center justify-start w-48 gap-3 text-base font-semibold cursor-pointer py-3 px-4 rounded-full`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-6 h-6 '
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z'
            />
          </svg>
          {'Events'}
        </div>
        <div
          onClick={() => {
            setActive('explore');
            router.push('explore');
          }}
          className={`${
            active === 'explore'
              ? 'bg-vapormintWhite-100 text-vapormintBlack-300'
              : 'text-vapormintWhite-100 hover:bg-vapormintBlack-200'
          } flex items-center justify-start w-48 gap-3 text-base font-semibold cursor-pointer py-3 px-4 rounded-full`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-6 h-6 '
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
            />
          </svg>
          {'Explore'}
        </div>
        <div
          onClick={() => {
            setActive('notifications');
            router.push('notifications');
          }}
          className={`${
            active === 'notifications'
              ? 'bg-vapormintWhite-100 text-vapormintBlack-300'
              : 'text-vapormintWhite-100 hover:bg-vapormintBlack-200'
          } flex items-center justify-start w-48 gap-3 text-base font-semibold cursor-pointer py-3 px-4 rounded-full`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-6 h-6 '
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0'
            />
          </svg>
          {'Notifications'}
        </div>
      </div>
      {/* buttons */}
      {path === '/home' && (
        <div
          onClick={() => router.push('/new_post')}
          className='flex items-center justify-start w-48 gap-3 px-4 py-3 m-4 text-lg font-bold rounded-full cursor-pointer bg-vapormintMint-300 text-vapormintBlack-300 '
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-6 h-6'
          >
            <path
              fillRule='evenodd'
              d='M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z'
              clipRule='evenodd'
            />
          </svg>
          New Post
        </div>
      )}

      {path === '/live' && (
        <div
          onClick={() => router.push('/go_live')}
          className='flex items-center justify-start w-48 gap-3 px-4 py-3 m-4 text-lg font-bold rounded-full cursor-pointer bg-vapormintSuccess-500 text-vapormintWhite-100 '
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-6 h-6'
          >
            <path d='M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z' />
          </svg>
          Go Live
        </div>
      )}
      {path === '/events' && (
        <div
          onClick={() => router.push('/create_event')}
          className='flex items-center justify-start w-48 gap-3 px-4 py-3 m-4 text-lg font-bold rounded-full cursor-pointer bg-vapormintLuxury-300 text-vapormintWhite-100 '
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-6 h-6'
          >
            <path d='M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z' />
          </svg>
          Host Event{' '}
        </div>
      )}
      {/* profile */}
      <div
        onClick={() => router.push(`/profile/${userState.userData.username}`)}
        className='p-4 cursor-pointer mt-auto border-t-[1px] border-vapormintBlack-200/60 flex gap-1 items-center'
      >
        <Avatar
          onClick={() => {}}
          size='md'
          kind='default'
          src={userState.userData.profile_image}
        />
        <div className='flex flex-col items-start'>
          <span className='text-lg font-bold text-vapormintWhite-100'>
            {userState.userData.username}
          </span>
          <span className='text-sm font-medium text-vapormintBlack-200'>
            {userState.userData.name}
          </span>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

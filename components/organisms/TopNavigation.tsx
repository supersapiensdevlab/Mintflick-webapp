'use client';
import React, { useContext } from 'react';
import Avatar from '../molecules/Avatar';
import Main_logo from '../molecules/MainLogo';
import { usePathname, useRouter } from 'next/navigation';
import { UserContext } from '@/contexts/userContext';

type Props = {};

export default function TopNavigation({}: Props) {
  const path = usePathname();
  const router = useRouter();
  const userState = useContext(UserContext);

  return path === '/home' || path === '/notifications' ? (
    <div className="absolute top-0 left-0 z-40 flex flex-col items-center w-full">
      <div className="flex items-center justify-between w-full max-w-lg px-4 py-2 bg-vapormintBlack-300/60 backdrop-blur-lg">
        <Avatar
          onClick={() => router.push(`/profile/${userState.userData.username}`)}
          size="sm"
          kind="default"
          src={userState.userData.profile_image}
        />
        <Main_logo />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 text-vapormintWhite-100"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
          />
        </svg>
      </div>
      <span
        style={{ height: `1px` }}
        className={`  w-full  bg-gradient-to-r from-vapormintBlack-300 via-vapormintWhite-100 to-vapormintBlack-300 max-w-2xl`}
      />
    </div>
  ) : (
    <div></div>
  );
}

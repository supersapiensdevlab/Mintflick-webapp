'use client';
import FullscreenContainer from '@/components/molecules/FullscreenContainer';
import Header from '@/components/molecules/Header';
import Image from 'next/image';
import React, { useContext, useState } from 'react';
import { UserContext } from '@/contexts/userContext';
import Divider from '@/components/molecules/Divider';
import social from '@/public/social.webp';
import FullScreenOverlay from '@/components/molecules/FullScreenOverlay';
import Settings from '../Settings';
import Pricing from '../Pricing';
import { useRouter } from 'next/navigation';

type Props = {};

export default function page({}: Props) {
  const userState = useContext(UserContext);
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState('posts');
  const [openSettings, setOpenSettings] = useState(false);

  const [openPricingModal, setOpenPricingModal] = useState(false);

  return (
    <FullscreenContainer className="select-none  border-x-[1px] border-vapormintBlack-200/60 relative flex flex-col items-start max-w-lg pt-14 mx-auto overflow-hidden bg-vapormintBlack-300">
      <Header
        text="Back"
        rightSection={
          <svg
            onClick={() => setOpenSettings(true)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer text-vapormintWhite-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
            />
          </svg>
        }
      />
      {openSettings && (
        <FullScreenOverlay
          animation="right"
          title={'Settings'}
          onClose={() => setOpenSettings(false)}
        >
          <Settings />
        </FullScreenOverlay>
      )}
      <div className="w-full h-full overflow-y-scroll snap-y scrollbar-none">
        <div className="flex flex-col items-start w-full">
          {userState.userData.cover_image ? (
            <Image
              className={`w-full object-cover aspect-video `}
              src={userState.userData.cover_image}
              alt="coverImage"
              width={100}
              height={100}
            />
          ) : (
            <div
              className={`  bg-vapormintBlack-200 animate-pulse w-full  aspect-video  `}
            />
          )}

          <div className="flex items-end w-full gap-1 px-4 py-3 -mt-12">
            {userState.userData.profile_image ? (
              <img
                className={`border-[4px] border-vapormintBlack-300/25 rounded-full w-20 h-20`}
                src={userState.userData.profile_image}
                alt="userImage"
              />
            ) : (
              <div
                className={` rounded-full bg-vapormintBlack-200 animate-pulse w-20 h-20 `}
              />
            )}
            <h1 className="text-2xl font-bold text-vapormintWhite-100">
              {userState.userData.username}
            </h1>
            <div
              onClick={() => router.push('/edit_profile')}
              className="flex items-center gap-1 p-1 ml-auto text-sm font-semibold cursor-pointer text-vapormintError-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 "
              >
                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
              </svg>
              Edit profile
            </div>
          </div>
        </div>
        <div
          onClick={() => setOpenPricingModal(true)}
          className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-vapormintLuxury-300"
        >
          {userState.userData.cover_image ? (
            <Image
              className={`w-16 object-cover aspect-square rounded-full`}
              src={userState.userData.cover_image}
              alt="superfanImage"
              width={100}
              height={100}
            />
          ) : (
            <div
              className={` rounded-full bg-vapormintBlack-200 animate-pulse w-16 h-16 `}
            />
          )}{' '}
          <div className="flex flex-col gap-[2px]">
            <h2 className="text-xl font-bold text-vapormintWhite-100">
              Become a Pro member
            </h2>{' '}
            <h2 className="text-xs font-semibold text-vapormintWhite-100">
              Text explaining how a creater get <br />
              benefited by these plans{' '}
            </h2>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 ml-auto text-vapormintWhite-100"
          >
            <path
              fillRule="evenodd"
              d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-vapormintBlue-300">
          {userState.userData.cover_image ? (
            <Image
              className={`w-16 object-cover aspect-square rounded-full`}
              src={userState.userData.cover_image}
              alt="superfanImage"
              width={100}
              height={100}
            />
          ) : (
            <div
              className={` rounded-full bg-vapormintBlack-200 animate-pulse w-16 h-16 `}
            />
          )}{' '}
          <div className="flex flex-col gap-[2px]">
            <h2 className="text-xl font-bold text-vapormintWhite-100">
              Setup Superfan plans
            </h2>{' '}
            <h2 className="text-xs font-semibold text-vapormintWhite-100">
              Text explaining how a creater get <br />
              benefited by these plans{' '}
            </h2>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 ml-auto text-vapormintWhite-100"
          >
            <path
              fillRule="evenodd"
              d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex items-center justify-between px-12 py-4">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-vapormintWhite-100">
              243K
            </span>{' '}
            <span className="text-base font-semibold text-vapormintWhite-300">
              Followers
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-vapormintWhite-100">
              122
            </span>{' '}
            <span className="text-base font-semibold text-vapormintWhite-300">
              Following
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-vapormintWhite-100">
              4K
            </span>
            <span className="text-base font-semibold text-vapormintWhite-300">
              Superfans
            </span>
          </div>
        </div>
        <Divider kind="center" size={1} />
        <div className="flex flex-col gap-2 px-4 py-2 text-vapormintWhite-100">
          <span className="text-lg font-semibold ">
            {userState.userData.name}
          </span>
          <span className="text-base font-light ">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint. Velit officia consequat duis enim velit mollit. Exercitation
            veniam consequat sunt nostrud amet.{' '}
          </span>
        </div>{' '}
        <Divider kind="solid" size={1} />
        <div className="sticky top-0 flex items-center p-4 gap-9 bg-vapormintBlack-300">
          <span
            onClick={() => setSelectedTab('posts')}
            className={`text-base font-bold uppercase cursor-pointer tracking-[.16em] ${
              selectedTab === 'posts'
                ? 'text-vapormintWhite-100'
                : 'text-vapormintBlack-200'
            }`}
          >
            posts
          </span>
          <span
            onClick={() => setSelectedTab('nfts')}
            className={`text-base font-bold uppercase cursor-pointer tracking-[.16em] ${
              selectedTab === 'nfts'
                ? 'text-vapormintWhite-100'
                : 'text-vapormintBlack-200'
            }`}
          >
            NFTs
          </span>{' '}
          <span
            onClick={() => setSelectedTab('superfans')}
            className={`text-base font-bold uppercase cursor-pointer tracking-[.16em] ${
              selectedTab === 'superfans'
                ? 'text-vapormintWhite-100'
                : 'text-vapormintBlack-200'
            }`}
          >
            superfans
          </span>
        </div>
        <div className="grid w-full grid-cols-3 gap-[1px] h-full place-content-start">
          {selectedTab === 'posts' &&
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2].map(() => (
              <Image
                className={`w-full aspect-square object-cover`}
                src={social}
                alt="loginImage"
                width={100}
                height={100}
              />
            ))}
          {selectedTab === 'nfts' &&
            [1, 2, 2, 2, 3, 2, 2].map(() => (
              <Image
                className={`w-full aspect-square object-cover`}
                src={social}
                alt="loginImage"
                width={100}
                height={100}
              />
            ))}
          {selectedTab === 'superfans' &&
            [1, 3, 3, 2].map(() => (
              <Image
                className={`w-full aspect-square object-cover`}
                src={social}
                alt="loginImage"
                width={100}
                height={100}
              />
            ))}
        </div>
      </div>
      {openPricingModal && (
        <FullScreenOverlay
          animation="bottom"
          title={'Mintflick Pro'}
          onClose={() => setOpenPricingModal(false)}
        >
          <Pricing />
        </FullScreenOverlay>
      )}
    </FullscreenContainer>
  );
}

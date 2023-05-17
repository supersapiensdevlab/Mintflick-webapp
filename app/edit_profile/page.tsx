'use client';
import FullscreenContainer from '@/components/molecules/FullscreenContainer';
import Header from '@/components/molecules/Header';
import Image from 'next/image';
import React, { useContext, useState } from 'react';
import { UserContext } from '@/contexts/userContext';
import TextInput from '@/components/molecules/TextInput';
import TextareaInput from '@/components/molecules/TextareaInput';
import Button from '@/components/molecules/Button';

type Props = {};

export default function page({}: Props) {
  const userState = useContext(UserContext);
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  return (
    <FullscreenContainer className="select-none border-x-[1px] border-vapormintBlack-200/60 relative flex flex-col items-start max-w-lg pt-14 mx-auto overflow-hidden bg-vapormintBlack-300">
      <Header
        text="Back"
        rightSection={
          <span className="text-lg font-bold text-vapormintSuccess-500">
            Save
          </span>
        }
      />
      <div className="w-full h-full overflow-y-scroll snap-y scrollbar-none">
        <div className="flex flex-col items-start w-full">
          <div className="relative w-full ">
            {userState.userData.cover_image && (
              <div className="absolute flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full cursor-pointer bottom-2 right-2 backdrop-blur-lg bg-vapormintBlack-200/80 hover:bg-vapormintBlack-100/80 text-vapormintWhite-100">
                Edit
              </div>
            )}
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
          </div>

          <div className="relative gap-3 px-4 py-3 mx-auto -mt-20 space-y-2">
            {userState.userData.profile_image ? (
              <img
                className={`border-[4px] border-vapormintBlack-300/25 rounded-full w-36 h-36`}
                src={userState.userData.profile_image}
                alt="userImage"
              />
            ) : (
              <div
                className={` rounded-full bg-vapormintBlack-200 animate-pulse w-36 h-36 `}
              />
            )}
            <div className="flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full cursor-pointer bg-vapormintBlack-200 hover:bg-vapormintBlack-100 text-vapormintWhite-100">
              Update Profile Photo
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full gap-2 p-4">
          <TextInput
            title={'Username'}
            placeholder={userState.userData.username}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            value={userName}
          />{' '}
          <TextInput
            title={'Name'}
            placeholder={userState.userData.name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
          <TextInput
            title={'Email'}
            placeholder={userState.userData.email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
          />
          <TextareaInput
            title={'Bio'}
            placeholder={userState.userData.bio}
            onChange={(e) => {
              setBio(e.target.value);
            }}
            value={bio}
          />
          {/* <Button
            handleClick={() => {}}
            kind="success"
            size="base"
            type="ghost"
          >
            Save Changes
          </Button> */}
        </div>
      </div>
    </FullscreenContainer>
  );
}

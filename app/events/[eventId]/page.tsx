"use client";
import FullscreenContainer from "@/components/molecules/FullscreenContainer";
import Header from "@/components/molecules/Header";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { UserContext } from "@/contexts/userContext";
import Divider from "@/components/molecules/Divider";
import Avatar from "@/components/molecules/Avatar";
import USDT from "@/components/organisms/USDT";

type Props = {};

export default function page({}: Props) {
  const userState = useContext(UserContext);

  return (
    <FullscreenContainer className="select-none  border-x-[1px] border-vapormintBlack-200/60 relative flex flex-col items-start max-w-lg pt-14 mx-auto overflow-hidden bg-vapormintBlack-300">
      <Header text="Back" />
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
          <div className="w-full px-4 py-3">
            <h1 className="w-full text-2xl font-bold text-vapormintWhite-100">
              Event name
            </h1>
          </div>
        </div>{" "}
        <Divider kind="center" size={1} />
        <div className="flex gap-[2px] items-center px-4 py-3">
          <span className="text-sm font-semibold text-vapormintBlack-200">
            Hosted by
          </span>
          <Avatar kind="default" size="xs" />
          <span className="text-sm font-semibold text-vapormintWhite-300">
            Arlene McCoy
          </span>
        </div>
        <div className="flex items-center justify-between w-full px-4 py-3 cursor-pointer text-vapormintWhite-100 bg-vapormintSuccess-500">
          <h1 className="text-lg font-bold ">Book Ticket</h1>
          <div className="flex items-center gap-2 px-1 py-[2px] ml-auto mr-3">
            <USDT />
            <div className="flex items-end gap-[1px] text-2xl font-bold text-vapormintWhite-100">
              12
              <div className="mb-[2px] text-sm font-bold  ">USDT</div>
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
        <div className="flex gap-[2px] items-center px-4 py-3 w-full">
          <span className="text-sm font-semibold text-vapormintBlack-200">
            Bookings{" "}
          </span>
          <div className="flex items-center -space-x-4">
            <Avatar
              src={userState.userData.profile_image}
              kind="default"
              size="xs"
            />{" "}
            <Avatar
              src={userState.userData.profile_image}
              kind="default"
              size="xs"
            />{" "}
            <Avatar
              src={userState.userData.profile_image}
              kind="default"
              size="xs"
            />{" "}
            <Avatar
              src={userState.userData.profile_image}
              kind="default"
              size="xs"
            />{" "}
            <Avatar
              src={userState.userData.profile_image}
              kind="default"
              size="xs"
            />
          </div>
          <span className="text-xs font-medium text-vapormintSuccess-500">
            + 12 more
          </span>
          <span className="ml-auto text-sm font-semibold text-vapormintWarning-500">
            2 Tickets left
          </span>
        </div>
        <Divider kind="solid" size={1} />
        <div className="flex flex-col gap-2 px-4 py-2 text-vapormintWhite-100">
          <span className="text-lg font-semibold ">Description</span>
          <span className="text-base font-light ">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint. Velit officia consequat duis enim velit mollit. Exercitation
            veniam consequat sunt nostrud amet.{" "}
          </span>
        </div>{" "}
        <Divider kind="solid" size={1} />{" "}
        <div className="flex flex-col gap-2 px-4 py-2 text-vapormintWhite-100">
          <span className="text-lg font-semibold ">Details</span>
          <div className="flex items-center justify-start w-full gap-2 px-4 ">
            <h1 className="text-base font-medium text-vapormintWhite-300 ">
              Location
            </h1>{" "}
            <h1 className="text-base font-bold text-vapormintSuccess-400 ">
              Google maps link
            </h1>
          </div>{" "}
          <div className="flex items-center justify-start w-full gap-2 px-4 ">
            <h1 className="text-base font-medium text-vapormintWhite-300 ">
              Link
            </h1>{" "}
            <h1 className="text-base font-bold text-vapormintSuccess-400 ">
              link.com
            </h1>
          </div>{" "}
        </div>{" "}
      </div>
    </FullscreenContainer>
  );
}

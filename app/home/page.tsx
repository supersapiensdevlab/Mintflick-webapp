"use client";
import FullscreenContainer from "@/components/molecules/FullscreenContainer";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import Post from "@/components/organisms/Post";
import TopNavigation from "@/components/organisms/TopNavigation";
import React, { useState } from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <FullscreenContainer className="relative border-x-[1px] border-vapormintBlack-200/30 flex flex-col items-start max-w-lg mx-auto overflow-hidden bg-vapormintBlack-300">
      <div className="snap-y w-full h-full pt-16 overflow-y-scroll divide-y-[1px] divide-vapormintBlack-200/30  scrollbar-none">
        <Post /> <Post /> <Post /> <Post /> <Post /> <Post /> <Post /> <Post />
        <Post />
      </div>
    </FullscreenContainer>
  );
}

"use client";
import Fab from "@/components/molecules/Fab";
import FullscreenContainer from "@/components/molecules/FullscreenContainer";
import SearchBar from "@/components/molecules/SearchBar";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import LiveCard from "@/components/organisms/LiveCard";
import React, { useState } from "react";

type Props = {};

export default function page({}: Props) {
  const [searchText, setSearchText] = useState("");
  return (
    <FullscreenContainer className="border-x-[1px] border-vapormintBlack-200/60 relative flex flex-col items-start max-w-lg py-16 mx-auto overflow-hidden bg-vapormintBlack-300">
      <SearchBar
        placeholder={"Search here"}
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
        value={searchText}
        onClear={() => {
          setSearchText("");
        }}
      />
      <div className="w-full snap-y h-full  overflow-y-scroll divide-y-[1px] divide-vapormintBlack-200/60  scrollbar-none">
        <LiveCard />
        <LiveCard />
        <LiveCard />
        <LiveCard />
        <LiveCard />
        <LiveCard />
        <LiveCard />
      </div>
      <Fab
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        }
        kind="success"
        onClick={() => {}}
        size="small"
        showText={true}
        text={"Go Live"}
      />
    </FullscreenContainer>
  );
}

"use client";
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
    </FullscreenContainer>
  );
}

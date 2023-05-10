"use client";
import FullscreenContainer from "@/components/molecules/FullscreenContainer";
import SearchBar from "@/components/molecules/SearchBar";
import EventCard from "@/components/organisms/EventCard";

import React, { useState } from "react";

type Props = {};

export default function page({}: Props) {
  const [searchText, setSearchText] = useState("");
  return (
    <FullscreenContainer className="scroll-mt-16  snap-start border-x-[1px] border-vapormintBlack-200/60 relative flex flex-col items-start max-w-lg pt-16 mx-auto overflow-hidden bg-vapormintBlack-300">
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
        <EventCard /> <EventCard /> <EventCard /> <EventCard /> <EventCard />{" "}
        <EventCard />
      </div>
    </FullscreenContainer>
  );
}

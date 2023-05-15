"use client";
import Fab from "@/components/molecules/Fab";
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
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
        }
        kind="luxury"
        onClick={() => {}}
        size="small"
        showText={true}
        text={"New Event"}
      />
    </FullscreenContainer>
  );
}

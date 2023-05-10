"use client";
import React, { useState } from "react";
import FullscreenContainer from "@/components/molecules/FullscreenContainer";
import SearchBar from "@/components/molecules/SearchBar";
import TopCreaters from "./TopCreaters";
import HotTopics from "./HotTopics";
import Divider from "@/components/molecules/Divider";
import MostLiked from "./MostLiked";

type Props = {};

export default function page({}: Props) {
  const [searchText, setSearchText] = useState("");

  return (
    <FullscreenContainer className="select-none scroll-mt-16  snap-start border-x-[1px] border-vapormintBlack-200/30 relative flex flex-col items-start max-w-lg py-16 mx-auto overflow-hidden bg-vapormintBlack-300">
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
      <div className="flex flex-col w-full h-full overflow-y-scroll scrollbar-none">
        <TopCreaters />
        <Divider kind="center" size={1} />
        <HotTopics />
        <Divider kind="solid" size={1} />
        <MostLiked />
      </div>
    </FullscreenContainer>
  );
}

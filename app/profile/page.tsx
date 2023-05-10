import FullscreenContainer from "@/components/molecules/FullscreenContainer";
import Header from "@/components/molecules/Header";
import React from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <FullscreenContainer className="  border-x-[1px] border-vapormintBlack-200/60 relative flex flex-col items-start max-w-lg py-16 mx-auto overflow-hidden bg-vapormintBlack-300">
      <Header text="back" />
      <div className="w-full snap-y h-full  overflow-y-scroll divide-y-[1px] divide-vapormintBlack-200/60  scrollbar-none"></div>
    </FullscreenContainer>
  );
}

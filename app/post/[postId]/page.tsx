"use client";
import FullscreenContainer from "@/components/molecules/FullscreenContainer";
import Header from "@/components/molecules/Header";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { UserContext } from "@/contexts/userContext";
import Divider from "@/components/molecules/Divider";
import social from "@/public/social.webp";
import NftCoin from "@/components/organisms/NftCoin";
import Avatar from "@/components/molecules/Avatar";
import USDT from "@/components/organisms/USDT";
import CopyToClipboard from "@/components/molecules/CopyButton";
import Post from "@/components/organisms/Post";

type Props = {};

export default function page({}: Props) {
  const userState = useContext(UserContext);
  const [selectedTab, setSelectedTab] = useState("posts");

  return (
    <FullscreenContainer className="select-none  border-x-[1px] border-vapormintBlack-200/60 relative flex flex-col items-start max-w-lg pt-14 mx-auto overflow-hidden bg-vapormintBlack-300">
      <Header text="Back" />
      <div className="w-full h-full overflow-y-scroll snap-y scrollbar-none">
        <Post />
      </div>
    </FullscreenContainer>
  );
}

import FullscreenContainer from "@/components/molecules/FullscreenContainer";
import NotificationCard from "@/components/organisms/NotificationCard";
import React from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <FullscreenContainer className="overflow-y-auto scrollbar-none select-none    snap-start border-x-[1px] border-vapormintBlack-200/30 relative flex flex-col items-start max-w-lg py-16 mx-auto overflow-hidden bg-vapormintBlack-300">
      <span className="px-4 py-2 text-sm font-semibold tracking-[.16em] uppercase text-vapormintSuccess-500">
        new
      </span>
      <NotificationCard new /> <NotificationCard new />
      <span className="px-4 py-2 text-sm font-semibold tracking-[.16em] uppercase text-vapormintBlack-100">
        old
      </span>
      <NotificationCard /> <NotificationCard /> <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
    </FullscreenContainer>
  );
}

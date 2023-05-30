import Avatar from "@/components/molecules/Avatar";
import React from "react";

type Props = {};

export default function TopCreaters({}: Props) {
  return (
    <div className="flex flex-col w-full gap-2 py-4">
      <span className="px-4 text-sm font-semibold tracking-[.16em] uppercase text-vapormintWhite-100">
        top creaters
      </span>

      <div className="flex items-center justify-start w-full gap-1 px-4 overflow-y-auto snap-x scroll-pl-4 scrollbar-none ">
        {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(() => (
          <div className="flex flex-col items-center gap-1 snap-start h-fit w-fit">
            <div className="w-14 h-14">
              <Avatar size="lg" kind="luxury" />
            </div>
            <span className="text-sm font-medium text-vapormintWhite-100">
              Aubrey
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import Pill from "@/components/molecules/Pill";
import React from "react";

type Props = {};

export default function HotTopics({}: Props) {
  return (
    <div className="flex flex-col w-full gap-2 py-4">
      <span className="px-4 text-sm font-semibold tracking-[.16em] uppercase text-vapormintWhite-100">
        hot topics
      </span>
      <div className="w-full overflow-y-auto scrollbar-none">
        <div className="flex items-center justify-start w-full gap-1 px-4 ">
          {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(() => (
            <div className=" snap-start">
              <Pill kind="default" type="outlined">
                <span className="mx-2 text-sm font-light text-vapormintWhite-100">
                  McDonald's
                </span>
              </Pill>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-start w-full gap-1 px-4 ">
          {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(() => (
            <div className=" snap-start">
              <Pill kind="default" type="outlined">
                <span className="mx-2 text-sm font-light text-vapormintWhite-100">
                  McDonald's
                </span>
              </Pill>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

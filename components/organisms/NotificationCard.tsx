import React from "react";
import Avatar from "../molecules/Avatar";
import social from "@/public/social.webp";
import Image from "next/image";

type Props = {
  new?: boolean;
};

export default function NotificationCard(props: Props) {
  return (
    <div
      className={`flex items-center justify-start w-full gap-1 px-4 py-3 ${
        props.new && "bg-gradient-to-r from-vapormintMint-300/10 "
      }`}
    >
      <Avatar kind="default" size="lg" />
      <div className="flex flex-col items-start gap-[1px] flex-grow">
        <div className="flex items-center gap-1">
          <span className="text-base font-semibold text-vapormintWhite-100">
            Esther Howard
          </span>
          <span className="text-sm font-semibold text-vapormintBlack-200">
            1 hour ago
          </span>
        </div>
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-vapormintError-500"
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>

          <span className="text-base font-medium text-vapormintWhite-200">
            liked your post
          </span>
        </div>
      </div>
      <Image
        className={`h-12 w-12 m-[2px]   object-cover`}
        src={social}
        alt="loginImage"
        width={100}
        height={100}
      />
    </div>
  );
}

import React from "react";
import Avatar from "../molecules/Avatar";
import Tick from "../molecules/Tick";
import Image from "next/image";
import social from "@/public/social.webp";
import NftCoin from "./NftCoin";
import { useRouter } from "next/navigation";

type Props = {};

export default function LiveCard({}: Props) {
  const router = useRouter();

  return (
    <div className="w-full p-4 space-y-2 select-none snap-start">
      <div className="flex items-end w-full gap-2">
        <Image
          className={`w-full    h-full object-cover rounded-lg border-[0.5px] border-vapormintBlack-200`}
          src={social}
          alt="loginImage"
          width={100}
          height={100}
        />
        <div className="flex flex-col items-center justify-end gap-3 w-fit">
          <div className="flex flex-col items-center gap-[2px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-vapormintBlack-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

            <span className="text-xs font-semibold text-vapormintWhite-300">
              999K
            </span>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-vapormintBlack-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
            />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-vapormintBlack-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Avatar kind="success" size="md" />
        <div className="flex flex-col gap-[1px]">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold cursor-pointer text-vapormintWhite-100">
              username
            </span>
            <Tick />
            <span className="text-sm font-medium cursor-pointer text-vapormintMint-300">
              Follow
            </span>
          </div>
          <span className="text-sm font-semibold text-vapormintSuccess-500">
            Live Now
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-grow gap-1">
        <span className="text-lg font-bold text-vapormintWhite-200">
          Amet minim mollit non deserunt
        </span>
        <p className="text-base font-medium text-vapormintBlack-100">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis enim velit mollit. Exercitation
          veniam consequat sunt nostrud amet.
        </p>
      </div>
    </div>
  );
}

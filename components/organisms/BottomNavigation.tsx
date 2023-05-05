"use client";
import React from "react";
import GradientDivider from "../molecules/GradientDivider";
import { usePathname, useRouter } from "next/navigation";

type Props = {};

export default function BottomNavigation({}: Props) {
  const router = useRouter();
  const path = usePathname();

  return path === "/home" ||
    path === "/live" ||
    path === "/events" ||
    path === "/explore" ||
    path === "/notifications" ? (
    <div className="absolute bottom-0 left-0 z-50 flex flex-col w-full transition-all ease-in-out select-none ">
      <GradientDivider />
      <div className="flex items-center w-full max-w-lg px-4 py-3 mx-auto bg-vapormintBlack-300/90 backdrop-blur-lg">
        <div
          onClick={() => router.push("home")}
          className="flex flex-col items-center justify-start w-1/5 gap-1 text-xs font-semibold cursor-pointer text-vapormintWhite-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-vapormintWhite-100"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>{" "}
          {path === "/home" && "Home"}
        </div>
        <div
          onClick={() => router.push("live")}
          className="flex flex-col items-center justify-start w-1/5 gap-1 text-xs font-semibold cursor-pointer text-vapormintWhite-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-vapormintWhite-100"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          {path === "/live" && "Live"}
        </div>
        <div
          onClick={() => router.push("events")}
          className="flex flex-col items-center justify-start w-1/5 gap-1 text-xs font-semibold cursor-pointer text-vapormintWhite-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-vapormintWhite-100"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
            />
          </svg>
          {path === "/events" && "Events"}
        </div>
        <div className="flex flex-col items-center justify-start w-1/5 gap-1 text-xs font-semibold cursor-pointer text-vapormintWhite-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-vapormintWhite-100"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          {path === "/explore" && "Explore"}
        </div>
        <div className="flex flex-col items-center justify-start w-1/5 gap-1 text-xs font-semibold cursor-pointer text-vapormintWhite-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-vapormintWhite-100"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
          {path === "/notifications" && "Notifications"}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

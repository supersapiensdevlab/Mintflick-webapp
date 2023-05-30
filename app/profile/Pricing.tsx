import Image from "next/image";
import React from "react";
import social from "@/public/social.webp";
import USDT from "@/components/organisms/USDT";

type Props = {};

export default function Pricing({}: Props) {
  return (
    <div className="flex flex-col items-center w-full h-full gap-8 p-8 overflow-y-auto scrollbar-none">
      <span className="text-lg font-black text-center text-vapormintWhite-100">
        Some interesting text that could give a feeling of trust to the user.
      </span>
      {[1, 1, 1].map(() => (
        <div className="flex flex-col items-center w-full h-fit max-w-[283px]">
          <div className="w-full h-2 px-2">
            <div className="w-full h-full rounded-t-full bg-vapormintSuccess-200" />
          </div>
          <div className="flex flex-col w-full ">
            <div className="flex flex-col items-center px-4 pt-8 pb-2 rounded-t-lg bg-vapormintSuccess-100">
              <Image
                className={`w-16 object-cover aspect-square rounded-full`}
                src={social}
                alt="planImage"
                width={100}
                height={100}
              />
              <span className="text-2xl font-bold text-vapormintSuccess-500">
                Free
              </span>
              <div className="flex items-center gap-2">
                <USDT />
                <span className="text-2xl font-black text-vapormintBlack-300">
                  0 USDT
                </span>
              </div>
              <span className="text-xs font-semibold text-vapormintBlack-100">
                per month
              </span>
            </div>
            <div className="w-full px-8 pt-2 rounded-b-lg bg-vapormintWhite-100">
              <p className="mb-2 text-sm font-bold text-vapormintBlack-300">
                Description about this plan this could be anything that we want
                to display here.
              </p>
              <div className="flex flex-col items-start w-full gap-1 pt-1 pb-4">
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-vapormintSuccess-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-vapormintBlack-200">
                    Signed Merch
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-vapormintSuccess-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-vapormintBlack-200">
                    Signed Merch
                  </span>
                </div>{" "}
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-vapormintSuccess-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-vapormintBlack-200">
                    Signed Merch
                  </span>
                </div>{" "}
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-vapormintSuccess-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-vapormintBlack-200">
                    Signed Merch
                  </span>
                </div>{" "}
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-vapormintSuccess-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-vapormintBlack-200">
                    Signed Merch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

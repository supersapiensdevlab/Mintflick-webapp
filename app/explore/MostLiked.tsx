import Image from "next/image";
import React from "react";
import social from "@/public/social.webp";

type Props = {};

export default function MostLiked({}: Props) {
  return (
    <div className="flex flex-col w-full h-fit">
      <span className="w-full uppercase tracking-[.16em] text-lg font-semibold text-center p-[10px] text-vapormintWhite-100">
        most liked and brought
      </span>
      <div className="grid w-full grid-cols-3 gap-[1px]">
        {[
          1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
          2, 2, 2, 2, 2,
        ].map(() => (
          <Image
            className={`w-full aspect-square object-cover`}
            src={social}
            alt="loginImage"
            width={100}
            height={100}
          />
        ))}
      </div>
    </div>
  );
}
